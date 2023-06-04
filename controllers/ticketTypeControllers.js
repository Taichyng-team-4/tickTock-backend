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

export const checkOwner = catchAsync(async (req, res, next) => {
  const activityId = req.body.activityId;

  //Check activityId
  if (!activityId) throw errorTable.targetNotProvideError("activityId");

  //Find Activity
  const activity = await Activity.findById(activityId);
  if (!activity) throw errorTable.targetNotFoundError("Activity");

  //Find orgId、ownerId
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
  let ticketTypes, ticketTypeIds;
  const activityId = req.body.activityId;

  if (!(req.body.tickTypes && Array.isArray(req.body.tickTypes)))
    errorTable.validateError("tickTypes");

  //確認資料多筆，在每個 tickType 中加入 activityId
  req.body.tickTypes.forEach((tickType) => {
    tickType.activityId = activityId;
    tickType.saleStartAt = helper.toLocalTime(tickType.saleStartAt);
    tickType.saleEndAt = helper.toLocalTime(tickType.saleEndAt);
  });

  //創造ticketType
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    ticketTypes = await TicketType.create(req.body.tickTypes, { session });
    ticketTypeIds = ticketTypes.map((ticketType) => ticketType._id);
    await Activity.findByIdAndUpdate(
      activityId,
      { ticketTypeIds },
      {
        new: true,
        runValidators: true,
        session,
      }
    );
    await session.commitTransaction();
  } catch (error) {
    console.log(error);
    await session.abortTransaction();
    throw errorTable.createDBFailError("ticketType");
  } finally {
    session.endSession();
  }

  req.body.ticketTypeIds = ticketTypeIds;

  const data = ticketTypes.map((obj) => helper.sanitizeCreatedDoc(obj));
  // next();
  res.status(200).json({
    status: "success",
    data,
  });
});

export const checkUpdateOrCreate = catchAsync(async (req, res, next) => {
  req.body.updateTickTypes = req.body.tickTypes.filter((el) => !!el.id);
  req.body.createTickTypes = req.body.tickTypes
    .filter((el) => !el.id)
    .map((tickType) => ({
      ...tickType,
      activityId: req.body.activityId,
      saleStartAt: helper.toLocalTime(tickType.saleStartAt),
      saleEndAt: helper.toLocalTime(tickType.saleEndAt),
    }));

  next();
});

export const updateMany = catchAsync(async (req, res, next) => {
  let features;
  let finalResult = [];
  const activityId = req.body.activityId;
  const updateTickTypeIds = req.body.updateTickTypes.map((el) => el.id);

  // 1) Convert datetime
  req.body.tickTypes.forEach((tickType) => {
    if (tickType.saleStartAt)
      tickType.saleStartAt = helper.toLocalTime(tickType.saleStartAt);
    if (tickType.saleEndAt)
      tickType.saleEndAt = helper.toLocalTime(tickType.saleEndAt);
  });

  // 2) Update database
  const session = await mongoose.startSession();
  session.startTransaction();

  // 3) Delete the ticketType that does not provided list but exist
  const filter = {
    activityId,
    deletedAt: null,
    _id: { $nin: updateTickTypeIds },
  };
  const update = { $set: { deletedAt: Date.now() } };
  const options = { session: session };
  await TicketType.updateMany(filter, update, options);

  // 4) Update the ticketType which exist before
  finalResult = await Promise.all(
    req.body.updateTickTypes.map(async (data) => {
      const filter = { activityId, _id: data.id };
      const update = { $set: helper.removeObjKeys(data, ["id"]) };
      const options = { new: true, runValidators: true, session: session };

      const updatedDoc = TicketType.findOneAndUpdate(filter, update, options);

      features = new queryFeatures(updatedDoc, req.query);
      const outputData = await features.query;
      if (!outputData) throw errorTable.idNotFoundError();
      return outputData;
    })
  );

  // 5) Create the ticketType which not exist
  const createTicketTypes = await TicketType.create(req.body.createTickTypes, {
    session,
  });

  finalResult = [...finalResult, ...createTicketTypes];
  const finalResultIds = finalResult.map((el) => el.id);

  await Activity.findByIdAndUpdate(
    req.body.activityId,
    { ticketTypeIds: finalResultIds },
    { session }
  );

  await session.commitTransaction();
  session.endSession();

  res.status(200).json({
    status: "success",
    data: helper.removeDocsObjId(finalResult),
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

  await Activity.findByIdAndUpdate(
    req.body.activityId,
    {
      $pull: { ticketTypeIds: { $in: req.body.tickTypeIds } },
    },
    { session }
  );

  await session.commitTransaction();
  session.endSession();

  res.status(204).json({});
});
