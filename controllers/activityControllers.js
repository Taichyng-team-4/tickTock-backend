import mongoose from "mongoose";
import catchAsync from "../utils/error/catchAsync.js";
import Org from "../models/org.js";
import Venue from "../models/venue.js";
import Activity from "../models/activity.js";
import ActivitySetting from "../models/activitySetting.js";
import * as helper from "../utils/helper/helper.js";
import * as ticketTypeHelper from "../utils/helper/ticketType.js";
import * as errorTable from "../utils/error/errorTable.js";
import queryFeatures from "../utils/helper/queryFeatures.js";
import TicketType from "../models/ticketType.js";

export const setActivityId = catchAsync(async (req, res, next) => {
  const activityId = req.params.activityId
    ? req.params.activityId
    : req.params.id;
  req.body = { ...req.body, activityId };
  next();
});

export const checkOwner = catchAsync(async (req, res, next) => {
  // 1) Check activityId
  const activityId = req.body.activityId;
  if (!activityId) throw errorTable.targetNotProvideError("activityId");

  // 2) Find activity
  const activity = await Activity.findById(activityId);
  if (!activity) throw errorTable.targetNotFindError("Activity");

  // 3) Find org
  const orgId = activity.orgId.toString();
  const org = await Org.findById(orgId);
  if (!(org._id && org.ownerId)) throw errorTable.noPermissionError();

  // 4) Check permission
  const ownerId = org.ownerId.toString();
  if (ownerId !== req.user.id) throw errorTable.noPermissionError();
  req.activityId = activity.id;
  req.settingId = activity.settingId.toString();

  next();
});

export const createOne = catchAsync(async (req, res, next) => {
  let venue, setting, activity, ticketTypes, ticketTypeIds;

  // 1) Conver datetime
  req.body.startAt = helper.toLocalTime(req.body.startAt);
  req.body.endAt = helper.toLocalTime(req.body.endAt);

  // 2) Check Venue
  if (!req.body.venue && !req.body.venueId)
    throw errorTable.targetNotProvideError("Venue");

  if (req.body.venueId) {
    venue = await Venue.findById(req.body.venueId);
    if (!venue) throw errorTable.targetNotFoundError("Venue");
  }

  // 3) Check Org
  const org = await Org.findById(req.body.orgId);
  if (!org) throw errorTable.targetNotFoundError("Orgnaization");
  if (org.ownerId.toString() !== req.user.id)
    throw errorTable.noPermissionError();

  // 4) Create Activity and its setting
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // 1) create venue
    if (req.body.venue) {
      venue = await Venue.create([req.body.venue], {
        session,
      });
      req.body.venueId = venue[0]._id;
    }

    // 2) create setting
    setting = await ActivitySetting.create([req.body.setting], {
      session,
    });
    req.body.settingId = setting[0]._id;

    // 3) create activity
    activity = (await Activity.create([req.body], { session }))[0];

    // 4) create ticketTypes
    req.body.ticketTypeIds = [];
    if (req.body.ticketTypes && req.body.ticketTypes.length) {
      req.body.ticketTypes = ticketTypeHelper.ticketTypeAddActivityId(
        req.body.ticketTypes,
        activity.id
      );
      ticketTypes = await TicketType.create(req.body.ticketTypes, {
        session,
      });
      ticketTypeIds = ticketTypes.map((ticketType) => ticketType._id);
      activity = await Activity.findByIdAndUpdate(
        activity.id,
        { ticketTypeIds },
        { new: true, session }
      );
    }
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw errorTable.createDBFailError("activity");
  } finally {
    session.endSession();
  }

  res.status(200).json({
    status: "success",
    data: helper.sanitizeCreatedDoc(activity),
  });
});

export const updateOne = catchAsync(async (req, res, next) => {
  let venue, features, data;
  // 1) Conver datetime
  if (req.body.startAt) req.body.startAt = helper.toLocalTime(req.body.startAt);
  if (req.body.endAt) req.body.endAt = helper.toLocalTime(req.body.endAt);

  // 2) Sanitize req body
  delete req.body.settingId;

  // 3) Check Venue
  if (req.body.venue && req.body.venueId)
    throw errorTable.duplicatedInputFieldsError(["venue", "venueId"]);

  if (req.body.venueId) {
    venue = await Venue.findById(req.body.venueId);
    if (!venue) throw errorTable.targetNotFoundError("Venue");
  }

  // 4) Check Org
  if (req.body.orgId) {
    const org = await Org.findById(req.body.orgId);
    if (!org) throw errorTable.targetNotFoundError("Orgnaization");

    if (org.ownerId.toString() !== req.user.id)
      throw errorTable.noPermissionError();
  }

  // 5) Update Activity
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // 1) Update venue
    if (req.body.venue) {
      venue = await Venue.create([req.body.venue], {
        session: session,
      });
      req.body.venueId = venue[0]._id;
    }

    // 2) Update setting
    if (req.settingId && req.body.setting) {
      await ActivitySetting.findByIdAndUpdate(req.settingId, req.body.setting, {
        new: true,
        runValidators: true,
        session: session,
      });
    }

    // 3) Update ticketTypes
    delete req.body.ticketTypeIds;
    if (req.body.ticketTypes) {
      const ticketTypes = await ticketTypeHelper.updateTicketTypes(
        {
          activityId: req.params.id,
          updateQuery: req.body.updateTicketTypes,
          createQuery: req.body.createTicketTypes,
        },
        session
      );
      req.body.ticketTypeIds = ticketTypes.map((el) => el.id);
    }

    // 4) Update activity
    const activityQuery = Activity.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      session: session,
    });
    features = new queryFeatures(activityQuery, req.query).select();
    data = await features.query;
    if (!data) throw errorTable.idNotFoundError();
    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    throw errorTable.upateDBFailError("activity");
  } finally {
    session.endSession();
  }

  res.status(200).json({
    status: "success",
    data: helper.removeDocObjId(data),
  });
});

export const deleteOne = catchAsync(async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  // 1) Delete activity
  await Activity.findByIdAndUpdate(
    req.params.id,
    { deletedAt: Date.now() },
    { session: session }
  );

  // 2) Delete setting
  await ActivitySetting.findByIdAndUpdate(
    req.settingId,
    { deletedAt: Date.now() },
    { session: session }
  );

  // 3) Delete setting
  await TicketType.updateMany(
    { activityId: req.params.id, deletedAt: null },
    { deletedAt: Date.now() },
    { session: session }
  );

  await session.commitTransaction();
  session.endSession();

  res.status(204).json({});
});

export const getStatistics = catchAsync((req, res, next) => {
  res.status(201).json({
    code: "200",
    status: "success",
    activityId: "uuid",
    publish: 0,
    ticket: [
      {
        name: "早鳥票",
        start: "2023/01/03",
        end: "2023/01/25",
        price: 1600,
        state: "已結束",
        quantity: "總票數量",
        totalSold: "銷售總數量",
        refund: "退票量",
      },
    ],
    saleMethod: [
      {
        area: "A區域",
        start: "2023/01/03",
        end: "2023/01/25",
        ticket: "早鳥票",
        sold: "售出量",
      },
    ],
    ageRange: [
      {
        age: "男",
        sold: [
          {
            range: "18-25",
            sold: "售出量",
            amount: "銷售總金額",
          },
        ],
      },
      {
        age: "女",
        sold: [
          {
            range: "18-25",
            sold: "售出量",
            amount: "銷售總金額",
          },
        ],
      },
    ],
    dailySales: [
      { date: "2023/01/03", totalSold: "銷售總數量", amount: "銷售總金額" },
    ],
  });
});
