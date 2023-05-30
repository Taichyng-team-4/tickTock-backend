import mongoose from "mongoose";
import catchAsync from "../utils/error/catchAsync.js";
import TicketType from "../models/ticketType.js";
import TicketList from "../models/ticketList.js";
import * as helper from "../utils/helper/helper.js";
import * as errorTable from "../utils/error/errorTable.js";
import queryFeatures from "../utils/helper/queryFeatures.js";
import Activity from "../models/activity.js";
import Org from "../models/org.js";

import { v4 as uuidv4 } from "uuid";

export const setActivityId = catchAsync(async (req, res, next) => {
  req.body = { ...req.body, activityId: req.params.activityId };
  req.query.activityId = req.params.activityId;
  next();
});

export const checkOwner = catchAsync(async (req, res, next) => {
  const activityId = req.body.activityId;

  //Check activity
  if (!activityId) throw errorTable.targetNotProvideError("Activity");

  //確認資料多筆
  if (req.body.tickTypes) {
    // 在每個 tickType 中加入 activityId
    req.body.tickTypes.forEach((tickType) => {
      tickType.activityId = activityId;
    });
  }

  //Find orgid、ownerId
  const activity = await Activity.findById(activityId);
  const orgId = activity.orgId.toString();
  const result = await Org.findById(orgId);

  if (!result._id || !result.ownerId) throw errorTable.noPermissionError();

  //Check permission
  const ownerId = result.ownerId.toString();
  if (ownerId.toString() !== req.user._id.toString())
    throw errorTable.noPermissionError();
  next();
});

export const createMany = catchAsync(async (req, res, next) => {
  //創造ticketType
  const ticketTypes = await TicketType.create(req.body.tickTypes);

  const ticketTypeIds = ticketTypes.map((ticketType) => ticketType._id);

  req.body.ticketTypeIds = ticketTypeIds;

  const data = ticketTypes.map((obj) => helper.sanitizeCreatedDoc(obj));
  next();
  // res.status(200).json({
  //   status: "success",
  //   data,
  // });
});

export const updateMany = catchAsync(async (req, res, next) => {
  let features;
  const updatas = [];

  const session = await mongoose.startSession();
  session.startTransaction();

  //更新
  await Promise.all(
    req.body.tickTypes.map(async (data) => {
      const filter = { activityId: data.activityId, _id: data.id };
      const update = { $set: data };
      const options = { new: true, runValidators: true, session: session };
      const updatedDoc = await TicketType.findOneAndUpdate(
        filter,
        update,
        options
      );

      features = new queryFeatures(updatedDoc, req.query);
      updatas.push(await features.query);

      if (!updatas) throw errorTable.idNotFoundError();
    })
  );

  await session.commitTransaction();
  session.endSession();

  res.status(200).json({
    status: "success",
    message: helper.removeDocsObjId(updatas),
  });
});

export const deleteMany = catchAsync(async (req, res, next) => {
  //Update ticketType
  const session = await mongoose.startSession();
  session.startTransaction();

  await Promise.all(
    req.body.tickTypeIds.map(async (id) => {
      const update = { deletedAt: Date.now() };
      const options = { session: session };
      await TicketType.findByIdAndUpdate(id, update, options);
    })
  );
  await session.commitTransaction();
  session.endSession();

  res.status(204).json({});
});




export const createTicketList = catchAsync(async (req, res, next) => {
  // 前端判斷: if 前端該區域票數量+資料庫區域票數量 > 指定上限數量(暫定30)時: 顯示提示上限數量-資料庫票數量=該區域剩餘數量

  // const ticketTypeID = req.body.ticketTypeID
  const ticketTypeID = req.body.ticketTypeIds;
  
  const ticketTypes = await TicketType.find({ _id: { $in: ticketTypeID } });

  for (const ticketType of ticketTypes) {
    const ticketList = await TicketList.find({ ticketTypeId: ticketType._id });

    if (ticketList.length > 0) {
      throw errorTable.targetExists("ticketTypeID");
    }

    const activity = await Activity.findById(ticketType.activityId);
    if (!activity) throw errorTable.targetNotFindError("activity");

    const ticketListData = [];
    for (let i = 0; i < ticketType.total; i++) {
      const newTicket = {
        activityId: activity.id,
        ticketTypeId: ticketType.id,
        status: '未分配',
        modified_time: new Date(),
        seatNo: generateTicketNumber(), 
      };
      ticketListData.push(newTicket);
    }

    // 建立 ticketList 資料
    const createdTickets = await TicketList.create(ticketListData);

  }
  
  res.status(200).json({
    status: "success",
    message: "Ticket list created successfully.",
  });
});


const generateTicketNumber = () => {
  const ticketNumber = uuidv4().replace(/-/g, "").substring(0, 8).toUpperCase();
  return ticketNumber;
};