import mongoose from "mongoose";
import catchAsync from "../utils/error/catchAsync.js";
import TicketType from "../models/ticketType.js";
import * as helper from "../utils/helper/helper.js";
import * as errorTable from "../utils/error/errorTable.js";
import queryFeatures from "../utils/helper/queryFeatures.js";
import Activity from "../models/activity.js";
import Org from "../models/org.js";
import * as authHelper from "../utils/helper/auth.js";
import User from "../models/user.js";

export const getAll = catchAsync((req, res, next) => {
  res.status(200).json({
    code: "200",
    status: "success",
    message: "Get news successfully",
    data: [
      {
        ticketTypeId: "uuid-4445-77IO", //票種id
        ticketTypeName: "一般票", //票種名稱
        ticketTypeArea: "A", //座位區域
        ticketTypeprice: 1000, //票種的價格
        ticketTypeQuota: 100, //票種的總數量
        ticketTypeStartTime: "2023-06-01 17: 00: 00", //票種開售時間
        activityEndTime: "2023/06/03 19: 00: 00", //票種結束時間
      },
      {
        ticketTypeId: "uuid-4445-77I7", //票種id
        ticketTypeName: "早鳥票", //票種名稱
        ticketTypeArea: "A", //座位區域
        ticketTypeprice: 1000, //票種的價格
        ticketTypeQuota: 100, //票種的總數量
        ticketTypeStartTime: "2023-06-01 17: 00: 00", //票種開售時間
        activityEndTime: "2023/06/03 19: 00: 00", //票種結束時間
      },
    ],
  });
});

export const getOne = catchAsync((req, res, next) => {
  res.status(200).json({
    code: "200",
    status: "success",
    message: "Get news successfully",
    data: {
      ticketTypeName: "一般票", //票種名稱
      ticketTypeArea: "A", //座位區域
      ticketTypeprice: 1000, //票種的價格
      ticketTypeQuota: 100, //票種的總數量
      ticketTypeStartTime: "2023-06-01 17: 00: 00", //票種開售時間
      ticketTypeEndTime: "2023/06/03 19: 00: 00", //票種結束時間
      activityId: "uuid-4445-7745", //活動id
    },
  });
});

export const createOne = catchAsync(async(req, res, next) => {
  let ticketTypes;
  // 1) Conver datetime
  req.body.startAt = helper.toUTC(req.body.startAt);
  req.body.endAt = helper.toUTC(req.body.endAt);
 // 2) Check activity
 if (!req.body.activityId)
 throw errorTable.targetNotProvideError("Activity");
//3)創造ticketType
const session = await mongoose.startSession();
  session.startTransaction();

  ticketTypes = (await TicketType.create([req.body], {session: session,}))[0];
  
  await session.commitTransaction();
  session.endSession();

  res.status(200).json({
    status: "success",
    data: helper.sanitizeCreatedDoc(ticketTypes),
  });
});

export const updateOne = catchAsync(async(req, res, next) => {
  // 1) Conver datetime
  req.body.startAt = helper.toUTC(req.body.startAt);
  req.body.endAt = helper.toUTC(req.body.endAt);
 // 2) Check activity
 if (!req.body.activityId)
 throw errorTable.targetNotProvideError("Activity");
//3)Update ticketType
const session = await mongoose.startSession();
  session.startTransaction();

  const ticketTypes = TicketType.findByIdAndUpdate(req.params.id,req.body,{
    new: true,
    runValidators: true,
    session: session,
  });

  const features = new queryFeatures(ticketTypes, req.query).select();
  const data = await features.query;
  if (!data) throw errorTable.idNotFoundError();

  await session.commitTransaction();
  session.endSession();

  res.status(200).json({
    status: "success",
    message: helper.removeDocObjId(data),
  });
});

export const deleteOne = catchAsync(async(req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  await TicketType.findByIdAndUpdate(
    req.params.id,
    { deletedAt: Date.now() },
    { session: session }
  );

  await session.commitTransaction();
  session.endSession();

   res.status(204).json({});

});
export const checkOwner = catchAsync(async (req, res, next) => {
  //console.log(req.body.activityId);
  //Find activity
  if (!req.body.activityId)
throw errorTable.targetNotProvideError("TicketType");

const activity = await Activity.findById(req.body.activityId);
  //Find orgid、ownerId
  const orgId = activity.orgId.toString();
  const result = await Org.findById(orgId);
 // console.log(result._id);
  //console.log(result.ownerId);
  if(!result._id || !result.ownerId)
  throw errorTable.targetNotProvideError("Org");

   //Get token
   let token;
   if (authHelper.isTokenExist(req.headers.authorization))
    token = req.headers.authorization.split(" ")[1]; //Authorization: 'Bearer TOKEN
 if (!token) throw errorTable.AuthFailError();

 //Verify token
 const decodeToken = authHelper.decodeJWT(token);
 //Check if User exist
 const user = await User.findById(decodeToken.id);
 if (!user) throw errorTable.AuthFailError();
  //Check permission
  const ownerId = result.ownerId.toString();
  console.log('ownerId:'+ownerId.toString()+'user:'+user._id.toString());

  if (ownerId.toString() !== user._id.toString()) throw errorTable.noPermissionError();

  next();
});
