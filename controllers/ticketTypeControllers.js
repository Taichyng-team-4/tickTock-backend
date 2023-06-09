import mongoose from "mongoose";
import Activity from "../models/activity.js";
import TicketType from "../models/ticketType.js";
import TicketList from "../models/ticketList.js";
import * as helper from "../utils/helper/helper.js";
import catchAsync from "../utils/error/catchAsync.js";
import * as errorTable from "../utils/error/errorTable.js";
import queryFeatures from "../utils/helper/queryFeatures.js";
import * as ticketTypeHelper from "../utils/helper/ticketType.js";
import * as ticketListHelper from "../utils/helper/ticketList.js";

export const getAll = catchAsync(async (req, res, next) => {
  const features = new queryFeatures(TicketType.find({}), req.query)
    .filter()
    .select()
    .sort()
    .paginate()
    .populate()
    .includeDeleted();
  let data = await features.query;
  data = helper.removeDocsObjId(data);

  if (req.query.pop)
    data = data.map((el) =>
      helper.removeFieldsId(el, req.query.pop.split(","))
    );

  // add remain ticket
  await Promise.all(
    data.map(async (ticketType) => {
      const result = await TicketList.aggregate([
        {
          $match: {
            ticketTypeId: new mongoose.Types.ObjectId(ticketType.id),
            deletedAt: null,
          },
        },
        {
          $group: {
            _id: null,
            remain: {
              $sum: {
                $cond: [
                  {
                    $or: [{ $eq: ["$ticketId", null] }, { $not: "$ticketId" }],
                  },
                  1,
                  0,
                ],
              },
            },
          },
        },
      ]);
      if (result && result.length === 1) ticketType.remain = result[0].remain;
      else ticketType.remain = 0;
    })
  );

  res.status(200).json({
    status: "success",
    count: data.length,
    data,
  });
});

export const createMany = catchAsync(async (req, res, next) => {
  let ticketTypes, ticketTypeIds;
  const activityId = req.body.activityId;

  if (!(req.body.ticketTypes && Array.isArray(req.body.ticketTypes)))
    errorTable.validateError("ticketTypes");

  //確認資料多筆，在每個 ticketType 中加入 activityId
  req.body.ticketTypes = helper.addActivityIdToObjs(
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
    // 1) create ticket type
    ticketTypes = await TicketType.create(req.body.ticketTypes, { session });
    ticketTypeIds = ticketTypes.map((ticketType) => ticketType._id);

    // 2) create ticket lists
    await ticketListHelper.createTicketList(
      { activityId, ticketTypes },
      session
    );

    // 3) update activity
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
  try {
    // 1) update ticket type
    const ticketTypes = await ticketTypeHelper.updateTicketTypes(
      {
        activityId: req.body.activityId,
        updateQuery: req.body.updateTicketTypes,
        createQuery: req.body.createTicketTypes,
      },
      session
    );

    // 2) update ticket list
    await ticketListHelper.updateTicketLists(
      { activityId: req.body.activityId, ticketTypes },
      session
    );

    const ticketTypeIds = ticketTypes.map((el) => el.id);

    // 3) update activity
    await Activity.findByIdAndUpdate(
      req.body.activityId,
      { ticketTypeIds },
      { session }
    );
    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    throw errorTable.upateDBFailError("ticketType");
  } finally {
    session.endSession();
  }

  res.status(200).json({
    status: "success",
    data: helper.removeDocsObjId(ticketTypes),
  });
});

export const deleteMany = catchAsync(async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // 1) delete ticket type
    await Promise.all(
      req.body.ticketTypeIds.map(async (id) => {
        const update = { deletedAt: Date.now() };
        const options = { session: session };
        await TicketType.findByIdAndUpdate(id, update, options);
      })
    );

    // 2) delete ticket list
    await TicketList.updateMany(
      {
        activityId: req.body.activityId,
        deletedAt: null,
        ticketId: null,
        isTrading: false,
      },
      { $set: { deletedAt: Date.now() } },
      { session }
    );

    // 3) delete activity
    await Activity.findByIdAndUpdate(
      req.body.activityId,
      {
        $pull: { ticketTypeIds: { $in: req.body.ticketTypeIds } },
      },
      { session }
    );
    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    throw errorTable.upateDBFailError("activity");
  } finally {
    session.endSession();
  }

  res.status(204).json({});
});
