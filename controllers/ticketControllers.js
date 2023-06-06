import mongoose from "mongoose";
import * as helper from "../utils/helper/helper.js";
import catchAsync from "../utils/error/catchAsync.js";
import * as errorTable from "../utils/error/errorTable.js";

import Ticket from "../models/ticket.js";
import Activity from "../models/activity.js";
import TicketType from "../models/ticketType.js";
import TicketList from "../models/ticketList.js";

export const getMe = catchAsync(async (req, res, next) => {
  req.query.ownerId = req.user.id;
  next();
});

export const checkOwner = catchAsync(async (req, res, next) => {
  // 1) Find the ticket
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) throw errorTable.idNotFoundError();

  // 2) Check the ticket owner
  if (ticket.ownerId.toString() !== req.user.id)
    throw errorTable.noPermissionError();

  req.ticket = ticket;

  next();
});

export const checkOwners = catchAsync(async (req, res, next) => {
  if (!Array.isArray(req.body.ticketIds))
    throw errorTable.validateError("ticketIds");

  // 1) Find the tickets
  const tickets = await Ticket.find({ _id: { $in: req.body.ticketIds } });
  if (tickets.length !== req.body.ticketIds.length)
    throw errorTable.idNotFoundError();

  // 2) Check the tickets owner
  tickets.every((el) => {
    if (el.ownerId.toString() !== req.user.id)
      throw errorTable.noPermissionError();
  });

  req.tickets = tickets;
  next();
});

export const createMany = catchAsync(async (req, res, next) => {
  let tickets = [],
    createList = {};
  // 1) check the ticket type and convert it to dictionary
  req.body.tickets.forEach((el) => {
    if (!el.ticketTypeId) throw errorTable.validateError("ticketTypeId");
    if (el.amount && typeof +el.amount === "number") {
      if (createList[el.ticketTypeId]) {
        createList[el.ticketTypeId].amount += +el.amount;
      } else {
        createList[el.ticketTypeId] = {
          amount: el.amount,
        };
      }
    }
  });

  // 2) Find the ticket type
  const ticketTypeIds = Object.keys(createList);
  const ticketTypes = await TicketType.find({ _id: { $in: ticketTypeIds } });
  if (ticketTypes.length !== ticketTypeIds.length)
    throw errorTable.tradingFailError();

  // 2) check the sales duration
  // if (
  //   !(ticketType.saleEndAt >= Date.now() && Date.now() >= ticketType.saleStartAt)
  // ) {
  //   throw errorTable.notSaleDurationError();
  // }

  // 3) Get the activity
  const activityIds = Array.from(
    new Set(ticketTypes.map((ticketType) => ticketType.activityId.toString()))
  );
  const activitys = await Activity.find({ _id: { $in: activityIds } });
  if (activitys.length !== activityIds.length)
    throw errorTable.tradingFailError();

  // 4) Insert the information
  ticketTypes.forEach((ticketType) => {
    createList[ticketType.id].ticketType = ticketType;
    createList[ticketType.id].activity = activitys.filter(
      (activity) => ticketType.activityId.toString() === activity.id
    )[0];
  });

  // 5) Start trading
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await Promise.all(
      Object.values(createList).map(async (query) => {
        let result, registTickets;
        // 1) regist the ticket to the ticket list and get the zone, seatNo, price and qrcode information
        registTickets = await TicketList.find({
          ticketTypeId: query.ticketType.id,
          ticketId: null,
        }).limit(query.amount);
        if (!registTickets.length) throw errorTable.tradingFailError();

        const ids = registTickets.map((el) => el.id);
        await TicketList.updateMany(
          {
            _id: { $in: ids },
            ticketTypeId: query.ticketType.id,
            ticketId: null,
          },
          { isTrading: true },
          { session, new: true }
        );

        // 2) create order with cash flow

        // 3) create the ticket and regist to user
        const ticketDatas = registTickets.map((el) => ({
          registId: el.id,
          ownerId: req.user.id,
          activityId: query.activity.id,
          ticketTypeId: query.ticketType.id,
          zone: query.ticketType.zone,
          seatNo: el.seatNo,
          price: query.ticketType.price,
          startAt: query.activity.startAt,
          expiredAt: query.activity.endAt,
        }));
        const createdTickets = await Ticket.create(ticketDatas, { session });
        if (!createdTickets.length) throw errorTable.createDBFailError();
        tickets = [...tickets, ...createdTickets];

        // Registed the tickets
        registTickets.forEach((registTicket) => {
          const seatNo = registTicket.seatNo;
          registTicket.ticketId = createdTickets.filter(
            (el) => el.seatNo === seatNo
          )[0].id;
        });
        await Promise.all(
          registTickets.map(async (el) => {
            await TicketList.findByIdAndUpdate(
              el.registId,
              {
                isTrading: false,
                ticketId: registTickets.ticketId,
              },
              { session }
            );
          })
        );
      })
    );

    await session.commitTransaction();
  } catch (error) {
    console.log(error);
    await session.abortTransaction();
    throw errorTable.createDBFailError("ticket");
  } finally {
    session.endSession();
  }

  res.status(200).json({
    status: "success",
    data: helper.sanitizeCreatedDoc(tickets),
  });
});

export const deleteOne = catchAsync(async (req, res, next) => {
  // 1) check the ticket has been refuned or expired
  if (req.ticket.refundedAt || Date.now() > req.ticket.startAt)
    throw errorTable.noPermissionError();

  // 2) refund the ticket
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // 1) update the ticket state
    await Ticket.findByIdAndUpdate(
      req.params.id,
      {
        refundedAt: Date.now(),
      },
      { session }
    );

    // 2) sign out the ticket from ticketList
    await TicketList.findByIdAndUpdate(
      req.ticket.ticketTypeId,
      { ticketId: null },
      { session }
    );

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw errorTable.createDBFailError("ticket");
  } finally {
    session.endSession();
  }

  res.status(204).json({});
});

export const deleteMany = catchAsync(async (req, res, next) => {
  // 1) check the ticket has been refuned or expired
  req.tickets.forEach((ticket) => {
    if (ticket.refundedAt || Date.now() > ticket.startAt)
      throw errorTable.noPermissionError();
  });

  // 2) refund the tickets
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // 1) update the ticket state
    await Ticket.updateMany(
      { _id: { $in: req.body.ticketIds }, refundedAt: null, deletedAt: null },
      {
        $set: { refundedAt: Date.now() },
      },
      { session }
    );

    // 2) sign out the ticket from ticketList
    await TicketList.updateMany(
      {
        ticketId: { $in: req.body.ticketIds },
        refundedAt: null,
        deletedAt: null,
      },
      { $set: { ticketId: null } },
      { session }
    );

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw errorTable.createDBFailError("tickets");
  } finally {
    session.endSession();
  }

  res.status(204).json({});
});
