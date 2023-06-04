import Activity from "../models/activity.js";
import TicketType from "../models/ticketType.js";
import TicketList from "../models/ticketList.js";
import * as helper from "../utils/helper/helper.js";
import catchAsync from "../utils/error/catchAsync.js";
import * as errorTable from "../utils/error/errorTable.js";
import mongoose from "mongoose";

export const createTicketList = catchAsync(async (req, res, next) => {
  // 前端判斷: if 前端該區域票數量+資料庫區域票數量 > 指定上限數量(暫定30)時: 顯示提示上限數量-資料庫票數量=該區域剩餘數量
  let resultData = [];

  // 1) Checking the ticket type format
  const ticketTypeIds = req.body.ticketTypeIds;
  if (!Array.isArray(req.body.ticketTypeIds))
    throw errorTable.validateErrorHandler("ticketTypeIds");

  // 2) Checking the activity if exist
  const activity = await Activity.findById(req.body.activityId);
  if (!activity) throw errorTable.targetNotFindError("activity");

  // 3) Checking the ticket type if exist
  const ticketTypes = await TicketType.find({
    activityId: req.body.activityId,
    _id: { $in: ticketTypeIds },
  });

  if (ticketTypes.length !== ticketTypeIds.length)
    throw errorTable.validateErrorHandler("ticketTypeIds");

  // 4) Checking the ticket type should not in the ticket list
  const ticketLists = await TicketList.find({
    ticketTypeId: { $in: ticketTypeIds },
  });
  if (ticketLists.length > 0) throw errorTable.targetExists("ticketTypeID");

  // 5) Create Ticket List
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    for (const ticketType of ticketTypes) {
      if (typeof ticketType.total !== "number")
        throw errorTable.wrongFormatError();

      const ticketListData = [];
      for (let i = 0; i < ticketType.total; i++) {
        const newTicket = {
          activityId: req.body.activityId,
          ticketTypeId: ticketType.id,
          seatNo: helper.generateTicketNumber(),
        };
        ticketListData.push(newTicket);
      }

      // 建立 ticketList 資料
      const createdTickets = await TicketList.create(ticketListData, {
        session,
      });
      resultData = [...createdTickets];
    }
    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    throw errorTable.dBTransactionFailError();
  } finally {
    session.endSession();
  }

  res.status(200).json({
    status: "success",
    message: "Ticket list created successfully.",
    data: helper.sanitizeCreatedDoc(resultData),
  });
});
