import mongoose from "mongoose";
import catchAsync from "../utils/error/catchAsync.js";
import TicketType from "../models/ticketType.js";
import * as helper from "../utils/helper/helper.js";
import * as errorTable from "../utils/error/errorTable.js";
import Org from "../models/org.js";
import Activity from "../models/activity.js";
import queryFeatures from "../utils/helper/queryFeatures.js";

export const setActivityId = catchAsync(async (req, res, next) => {
  req.body = { ...req.body, activityId: req.params.activityId };
  req.query.activityId = req.params.activityId;
  next();
});

export const checkOwnerAndJoinActivityId = catchAsync(
  async (req, res, next) => {
    const activityId = req.body.activityId;

    //Check activity
    if (!activityId) throw errorTable.targetNotProvideError("Activity");

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
  }
);

export const createMany = catchAsync(async (req, res, next) => {
  let ticketTypes;
  const activityId = req.body.activityId;

  if (!(req.body.tickTypes && Array.isArray(req.body.tickTypes)))
    errorTable.validateError("tickTypes");

  //確認資料多筆，在每個 tickType 中加入 activityId
  req.body.tickTypes.forEach((tickType) => {
    tickType.activityId = activityId;
    tickType.startAt = helper.toLocalTime(tickType.startAt);
    tickType.endAt = helper.toLocalTime(tickType.endAt);
  });

  //創造ticketType
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    ticketTypes = await TicketType.create(req.body.tickTypes, { session });
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw errorTable.createDBFailError("ticketType");
  } finally {
    session.endSession();
  }

  const data = ticketTypes.map((obj) => helper.sanitizeCreatedDoc(obj));

  res.status(200).json({
    status: "success",
    data,
  });
});

export const updateMany = catchAsync(async (req, res, next) => {
  let features;
  let updatAs = [];
  const activityId = req.body.activityId;
  const tickTypeIds = req.body.tickTypes.map((el) => el.id);

  // 1) Convert datetime
  req.body.tickTypes.forEach((tickType) => {
    tickType.startAt = helper.toLocalTime(tickType.startAt);
    tickType.endAt = helper.toLocalTime(tickType.endAt);
  });

  // 2) Update database
  const session = await mongoose.startSession();
  session.startTransaction();

  // Delete
  const filter = {
    activityId,
    deletedAt: null,
    _id: { $nin: tickTypeIds },
  };
  const update = { $set: { deletedAt: Date.now() } };
  const options = { session: session };
  await TicketType.updateMany(filter, update, options);

  // 更新
  updatAs = await Promise.all(
    req.body.tickTypes.map(async (data) => {
      const filter = { activityId, _id: data.id };
      const update = { $set: data };
      const options = { new: true, runValidators: true, session: session };
      const updatedDoc = await TicketType.findOneAndUpdate(
        filter,
        update,
        options
      );

      features = new queryFeatures(updatedDoc, req.query);
      const outputData = await features.query;
      if (!outputData) throw errorTable.idNotFoundError();
      return outputData;
    })
  );

  await session.commitTransaction();
  session.endSession();

  res.status(200).json({
    status: "success",
    data: helper.removeDocsObjId(updatAs),
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
