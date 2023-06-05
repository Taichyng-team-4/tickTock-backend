import mongoose from "mongoose";
import catchAsync from "../utils/error/catchAsync.js";
import TicketType from "../models/ticketType.js";
import * as helper from "../utils/helper/helper.js";
import * as errorTable from "../utils/error/errorTable.js";
import Activity from "../models/activity.js";
import * as ticketTypeHelper from "../utils/helper/ticketType.js";

export const createMany = catchAsync(async (req, res, next) => {
  let ticketTypes, ticketTypeIds;
  const activityId = req.body.activityId;

  if (!(req.body.ticketTypes && Array.isArray(req.body.ticketTypes)))
    errorTable.validateError("ticketTypes");

  //確認資料多筆，在每個 ticketType 中加入 activityId
  req.body.ticketTypes = helper.addActivityIdtOObjs(
    req.body.ticketTypes,
    activityId
  );
  req.body.ticketTypes.forEach((ticketType) => {
    ticketType.saleStartAt = helper.toLocalTime(ticketType.saleStartAt);
    ticketType.saleEndAt = helper.toLocalTime(ticketType.saleEndAt);
  });

  //創造ticketType
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    ticketTypes = await TicketType.create(req.body.ticketTypes, { session });
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

export const createUpdateTicketTypeInfo = catchAsync(async (req, res, next) => {
  if (req.body.ticketTypes) {
    req.body.updateTicketTypes = req.body.ticketTypes.filter((el) => !!el.id);
    req.body.createTicketTypes = req.body.ticketTypes
      .filter((el) => !el.id)
      .map((ticketType) => ({
        ...ticketType,
        activityId: req.body.activityId,
        saleStartAt: helper.toLocalTime(ticketType.saleStartAt),
        saleEndAt: helper.toLocalTime(ticketType.saleEndAt),
      }));
  }
  next();
});

export const updateMany = catchAsync(async (req, res, next) => {
  // 1) Convert datetime
  req.body.ticketTypes.forEach((ticketType) => {
    if (ticketType.saleStartAt)
      ticketType.saleStartAt = helper.toLocalTime(ticketType.saleStartAt);
    if (ticketType.saleEndAt)
      ticketType.saleEndAt = helper.toLocalTime(ticketType.saleEndAt);
  });

  // 2) Update database
  const session = await mongoose.startSession();
  session.startTransaction();

  const ticketTypes = await ticketTypeHelper.updateTicketTypes(
    {
      activityId: req.body.activityId,
      updateQuery: req.body.updateTicketTypes,
      createQuery: req.body.createTicketTypes,
    },
    session
  );
  const ticketTypeIds = ticketTypes.map((el) => el.id);

  await Activity.findByIdAndUpdate(
    req.body.activityId,
    { ticketTypeIds },
    { session }
  );

  await session.commitTransaction();
  session.endSession();

  res.status(200).json({
    status: "success",
    data: helper.removeDocsObjId(ticketTypes),
  });
});

export const deleteMany = catchAsync(async (req, res, next) => {
  //Update ticketType
  const session = await mongoose.startSession();
  session.startTransaction();

  await Promise.all(
    req.body.ticketTypeIds.map(async (id) => {
      const update = { deletedAt: Date.now() };
      const options = { session: session };
      await TicketType.findByIdAndUpdate(id, update, options);
    })
  );

  await Activity.findByIdAndUpdate(
    req.body.activityId,
    {
      $pull: { ticketTypeIds: { $in: req.body.ticketTypeIds } },
    },
    { session }
  );

  await session.commitTransaction();
  session.endSession();

  res.status(204).json({});
});
