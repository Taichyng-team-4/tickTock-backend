import catchAsync from "../utils/error/catchAsync.js";
import * as errorTable from "../utils/error/errorTable.js";

import Ticket from "../models/ticket.js";
import Acticity from "../models/activity.js";
import TicketType from "../models/ticketType.js";

export const checkOwner = catchAsync(async (req, res, next) => {
  // 1) Find the ticket
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) throw errorTable.idNotFoundError();

  // 2) Check the ticket owner
  if (ticket.ownerId !== req.user.id) throw errorTable.noPermissionError();

  req.ticket = ticket;
  next();
});

export const createOne = catchAsync(async (req, res, next) => {
  // 1) check the activity exist
  const activity = await Acticity.findById(req.body.acticityId);
  if (!activity) throw errorTable.idNotFoundError();

  // 2) check the ticketType
  const ticketType = await TicketType.findById(req.body.ticketTypeId);
  if (!ticketType) throw errorTable.idNotFoundError();
  if (ticketType.activityId !== activity.id)
    throw errorTable.inputRelationshipError("activity", "tickeType");

  // 3) regist the ticket to the ticket list and get the zone, seatNo, price and qrcode information
  // 4) create order with cash flow

  // 5) create the ticket and regist to user
  const ticketData = { ...req.body };
  const data = await Ticket.create(ticketData);
  res.status(200).json({
    status: "success",
    data: helper.sanitizeCreatedDoc(data),
  });
});

export const deleteOne = catchAsync(async (req, res, next) => {
  // 1) check the has refuned before and expired...?
  if (req.ticket.isRefunded || req.ticke.isExpired)
    return errorTable.noPermissionError();

  // 3) refund the ticket
  // 4) check out the ticket from ticketList
  // 5) update the ticket state
  await Model.findByIdAndUpdate(req.params.id, {
    refundedAt: Date.now(),
    expiredAt: Date.now(),
  });
  res.status(204).json({});
});
