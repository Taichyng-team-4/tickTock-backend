import mongoose from "mongoose";

import TicketType from "../models/ticketType.js";
import TicketList from "../models/ticketList.js";
import * as helper from "../utils/helper/helper.js";
import catchAsync from "../utils/error/catchAsync.js";
import * as errorTable from "../utils/error/errorTable.js";
import * as ticketListHelper from "../utils/helper/ticketList.js";

export const createMany = catchAsync(async (req, res, next) => {
  // 前端判斷: if 前端該區域票數量+資料庫區域票數量 > 指定上限數量(暫定30)時: 顯示提示上限數量-資料庫票數量=該區域剩餘數量
  let resultData = [];
  const activityId = req.body.activityId;

  // 1) Checking the ticket type if exist
  const ticketTypes = await TicketType.find({ activityId });

  // 2) The query ticketTypeIds should not have been created
  const isCreated = await TicketList.findOne({ activityId });
  if (!!isCreated) throw errorTable.alreadyCreatedError("TicketList");

  // 3) Construct the ticket list query
  const ticketListData = ticketListHelper.generateTicketListFromTicketTypes(
    req.body.activityId,
    ticketTypes
  );

  // 4) Create Ticket List
  resultData = await TicketList.create(ticketListData);

  res.status(200).json({
    status: "success",
    count: resultData.length,
    data: helper.sanitizeCreatedDoc(resultData),
  });
});

export const updateMany = catchAsync(async (req, res, next) => {
  const activityId = req.body.activityId;

  const ticketTypes = await TicketType.find({ activityId });

  // Update database
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await ticketListHelper.updateTicketLists(
      { activityId, ticketTypes },
      session
    );
    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    throw errorTable.dBTransactionFailError();
  } finally {
    session.endSession();
  }

  const newTicketTypes = await TicketList.find({ activityId });

  res.status(200).json({
    status: "success",
    count: newTicketTypes.length,
    data: helper.removeDocsObjId(newTicketTypes),
  });
});

export const deleteMany = catchAsync(async (req, res, next) => {
  await TicketList.updateMany(
    { activityId, deletedAt: null, ticketId: null },
    { $set: { deletedAt: Date.now() } }
  );

  res.status(204).json({});
});
