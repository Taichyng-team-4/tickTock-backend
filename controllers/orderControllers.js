import mongoose from "mongoose";

import Order from "../models/order.js";
import Ticket from "../models/ticket.js";
import Activity from "../models/activity.js";
import TicketList from "../models/ticketList.js";
import TicketType from "../models/ticketType.js";
import catchAsync from "../utils/error/catchAsync.js";
import * as orderHelper from "../utils/helper/order.js";
import * as errorTable from "../utils/error/errorTable.js";

export const createOrder = catchAsync(async (req, res, next) => {
  let data;
  let createList = {};
  // 1) check the ticket type and convert it to dictionary
  req.body.tickets.forEach((el) => {
    if (!el.ticketTypeId) throw errorTable.validateError("ticketTypeId");
    if (el.quantity && typeof +el.quantity === "number") {
      if (createList[el.ticketTypeId]) {
        createList[el.ticketTypeId].quantity += +el.quantity;
      } else {
        createList[el.ticketTypeId] = {
          quantity: el.quantity,
        };
      }
    }
  });

  // 2) Find the ticket type
  const ticketTypeIds = Object.keys(createList);
  const ticketTypes = await TicketType.find({ _id: { $in: ticketTypeIds } });
  if (ticketTypes.length !== ticketTypeIds.length)
    throw errorTable.tradingFailError();

  // 3) Get the activity
  const activityIds = Array.from(
    new Set(ticketTypes.map((ticketType) => ticketType.activityId.toString()))
  );
  const activitys = await Activity.find({ _id: { $in: activityIds } });
  if (activitys.length !== activityIds.length)
    throw errorTable.tradingFailError();

  // 4) Insert the information to createList
  ticketTypes.forEach((ticketType) => {
    createList[ticketType.id].ticketType = ticketType;
    createList[ticketType.id].activity = activitys.filter(
      (activity) => ticketType.activityId.toString() === activity.id
    )[0];
  });

  // 5) Start trading
  let finalOrderId;
  const orderDetail = [];
  let bookedTicketIds = [];
  const session = await mongoose.startSession();
  await session.withTransaction(async () => {
    try {
      // 1) Find the tickets need to be book in the activity ticket list and information
      await Promise.all(
        Object.values(createList).map(async (query) => {
          let bookedTickets;
          bookedTickets = await TicketList.find({
            ticketTypeId: query.ticketType.id,
            ticketId: null,
            isTrading: false,
          }).limit(query.quantity);
          if (!bookedTickets.length) throw errorTable.tradingFailError();

          const ids = bookedTickets.map((el) => el.id);
          bookedTicketIds = [...bookedTicketIds, ...ids];
          orderDetail.push({
            activityId: query.activity.id,
            ticketTypeId: query.ticketType.id,
            ticketListIds: ids,
          });
        })
      );

      // 2) Book the tickets in the activity ticket list
      await TicketList.updateMany(
        {
          _id: { $in: bookedTicketIds },
          ticketId: null,
        },
        { isTrading: true },
        { session, new: true }
      );

      // 3) Create order
      const amount = orderHelper.createPackageAmout(ticketTypes, createList); // We only have one package, so equal to the order amount

      const order = (
        await Order.create(
          [
            {
              ownerId: req.user.id,
              amount,
              currency: "JPY",
              detail: orderDetail,
            },
          ],
          { session }
        )
      )[0];
      finalOrderId = order.id;

      // 4) Create Line Pay cash flow
      const linePayBody = await orderHelper.creatLinePayBody({
        order,
        ticketTypes,
        createList,
      });

      const createOrderURL = "/v3/payments/request";
      const linePayHeaders = orderHelper.createLinePayHeader(
        createOrderURL,
        linePayBody
      );

      const response = await fetch(
        "https://sandbox-api-pay.line.me/v3/payments/request",
        {
          method: "POST",
          headers: linePayHeaders,
          body: JSON.stringify(linePayBody),
        }
      );
      if (!response.ok) throw errorTable.tradingFailError();
      data = await response.json();
      if (data.returnCode === "0000") {
        order.paymentUrl = data.info.paymentUrl.web;
        order.transactionId = data.info.transactionId;
        order.expiredAt = new Date();
        await order.save({ session });
      } else throw errorTable.tradingFailError();
    } catch (error) {
      throw errorTable.createDBFailError("ticket");
    }
  });

  // 6) setting timeout
  setTimeout(async () => {
    const targetOrderQuery = Order.findOne({
      _id: finalOrderId,
      expiredAt: { $ne: null },
    });
    targetOrderQuery.$locals = { getExpired: true };
    const targetOrder = await targetOrderQuery;
    if (targetOrder) {
      targetOrder.deletedAt = Date.now();
      await targetOrder.save();
      await TicketList.updateMany(
        {
          _id: { $in: bookedTicketIds },
          ticketId: null,
          isTrading: true,
        },
        { isTrading: false }
      );
    }
  }, 60 * 60 * 20);

  // res.redirect(data.info.paymentUrl.web);
  res.status(200).json({
    status: "success",
    data,
  });
});

export const confirmOrder = catchAsync(async (req, res) => {
  let data;
  let tickets = [];
  const orderTicketIds = [];

  const { transactionId, orderId } = req.query;
  const confirmURL = `/v3/payments/${transactionId}/confirm`;

  const orderQuery = Order.findOne({
    _id: orderId,
    expiredAt: { $ne: null },
  }).populate("detail.activityId detail.ticketTypeId detail.ticketListIds");
  orderQuery.$locals = { getExpired: true };
  const order = await orderQuery;

  if (!orderHelper.isOrderCorrect(order))
    throw errorTable.confirmTradingFailError();

  if (!order.detail.length)
    res
      .status(200)
      .json({ status: "success", message: "transaction successfully!" });

  const confirmBody = {
    amount: order.amount,
    currency: "JPY",
  };

  // 4) regist the tickets to user
  const session = await mongoose.startSession();
  await session.withTransaction(async () => {
    try {
      await Promise.all(
        order.detail.map(async (orderDetail) => {
          // 1) create tickets
          const ticketDatas = orderDetail.ticketListIds.map((el) => ({
            registId: el.id,
            ownerId: order.ownerId,
            activityId: orderDetail.activityId.id,
            ticketTypeId: orderDetail.ticketTypeId.id,
            zone: orderDetail.ticketTypeId.zone,
            seatNo: el.seatNo,
            price: orderDetail.ticketTypeId.price,
            startAt: orderDetail.activityId.startAt,
            expiredAt: orderDetail.activityId.endAt,
          }));

          const createdTickets = await Ticket.create(ticketDatas, { session });
          if (!createdTickets.length) throw errorTable.createDBFailError();
          tickets = [...tickets, ...createdTickets];

          // 2) Match the tickets and ticket list by seatNo
          orderDetail.ticketIds = [];
          orderDetail.ticketListIds.forEach((bookedTicket) => {
            const filterTickets = createdTickets.filter(
              (el) => el.seatNo === bookedTicket.seatNo
            );
            bookedTicket.ticketId = filterTickets[0].id;
            orderDetail.ticketIds.push(filterTickets[0].id);
          });
        })
      );

      // 3) Registed the ticket
      const registedTickets = order.detail
        .map((orderDetail) => orderDetail.ticketListIds)
        .flat();

      await Promise.all(
        registedTickets.map(async (el) =>
          TicketList.findByIdAndUpdate(
            el.id,
            {
              isTrading: false,
              ticketId: el.ticketId,
            },
            { session }
          )
        )
      );
      order.expiredAt = undefined;
      await order.save({ session });

      // 4) Confrim the transaction to Line Pay
      const headers = orderHelper.createLinePayHeader(confirmURL, confirmBody);
      const response = await fetch(
        process.env.LINEPAY_SERVER_URL + confirmURL,
        {
          method: "POST",
          headers,
          body: JSON.stringify(confirmBody),
        }
      );
      if (!response.ok) throw errorTable.confirmTradingFailError();
      data = await response.json();
      if (data.returnCode === "0000") await session.commitTransaction();
      else throw errorTable.confirmTradingFailError();
    } catch (err) {
      errorTable.confirmTradingFailError();
    }
  });

  res
    .status(200)
    .json({ status: "success", message: "transaction successfully!" });
});

export const cancelOrder = catchAsync((req, res) => {
  res
    .status(200)
    .json({ status: "success", message: "transaction cancel success!" });
});
