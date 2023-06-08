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
  const orderDetail = [];
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // 1) Book the tickets to the ticket list and get the zone, seatNo, price and qrcode information
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
        orderDetail.push({
          activityId: query.activity.id,
          ticketTypeId: query.ticketType.id,
          ticketIds: ids,
        });
        await TicketList.updateMany(
          {
            _id: { $in: ids },
            ticketTypeId: query.ticketType.id,
            ticketId: null,
          },
          { isTrading: true },
          { session, new: true }
        );
      })
    );

    // 2) Create order
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

    // 3) Create Line Pay cash flow
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
    if (data.returnCode === "0000") await session.commitTransaction();
    else throw errorTable.tradingFailError();
  } catch (error) {
    await session.abortTransaction();
    throw errorTable.createDBFailError("ticket");
  } finally {
    session.endSession();
  }

  // res.redirect(data.info.paymentUrl.web);
  res.status(200).json({
    status: "success",
    data,
  });
});

export const confirmOrder = catchAsync(async (req, res) => {
  let data;
  let tickets = [];
  const { transactionId, orderId } = req.query;
  const confirmURL = `/v3/payments/${transactionId}/confirm`;

  const order = await Order.findById(orderId).populate(
    "detail.activityId detail.ticketTypeId detail.ticketIds"
  );
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
  session.startTransaction();
  try {
    await Promise.all(
      order.detail.map(async (orderDetail) => {
        // 1) create tickets
        const ticketDatas = orderDetail.ticketIds.map((el) => ({
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
        orderDetail.ticketIds.forEach((bookedTicket) => {
          bookedTicket.ticketId = createdTickets.filter(
            (el) => el.seatNo === bookedTicket.seatNo
          )[0].id;
        });

        // 3) Registed the ticket
        await Promise.all(
          orderDetail.ticketIds.map(async (el) => {
            await TicketList.findByIdAndUpdate(
              el.id,
              {
                isTrading: false,
                ticketId: el.ticketId,
              },
              { session }
            );
          })
        );
      })
    );

    // 4) Confrim the transaction to Line Pay
    const headers = orderHelper.createLinePayHeader(confirmURL, confirmBody);
    const response = await fetch(process.env.LINEPAY_SERVER_URL + confirmURL, {
      method: "POST",
      headers,
      body: JSON.stringify(confirmBody),
    });
    if (!response.ok) throw errorTable.confirmTradingFailError();
    data = await response.json();
    if (data.returnCode === "0000") await session.commitTransaction();
    else throw errorTable.confirmTradingFailError();
  } catch (error) {
    await session.abortTransaction();
    throw errorTable.createDBFailError("ticket");
  } finally {
    session.endSession();
  }

  res
    .status(200)
    .json({ status: "success", message: "transaction successfully!" });
});

export const cancelOrder = catchAsync((req, res) => {
  res
    .status(200)
    .json({ status: "success", message: "transaction cancel success!" });
});
