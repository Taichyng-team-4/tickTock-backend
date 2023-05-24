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

export const getOne = catchAsync(async(req, res, next) => {

  const features = new queryFeatures(TicketType.find({activityId: req.params.id }), req.query)
  .select()
  .populate()
  .includeDeleted();
  let data = await features.query;
  data = helper.removeDocsObjId(data);

  if (req.query.pop)
    data = data.map((el) =>
      helper.removeFieldsId(el, req.query.pop.split(","))
    );

  res.status(200).json({
    status: "success",
    count: data.length,
    data,
  });
});

export const createOne = catchAsync(async (req, res, next) => {
  let ticketTypes, activityId;

  //檢查每筆資料的 activityId 
  if (Array.isArray(req.body)) {

    //確認新增資料皆為相同活動
    activityId = req.body[0].activityId; // 取得第一筆資料的 activityId

    // 檢查每筆資料的 activityId 是否都與第一筆相同
    const isValidActivityId = req.body.every((data) => data.activityId === activityId);

    if (!isValidActivityId) {
      return res.status(400).json({ error: 'All activityIds must be the same' });
    }
  } 

  //Check activity
  if (!activityId)
    throw errorTable.targetNotProvideError("Activity");

  //3)創造ticketType
  const session = await mongoose.startSession();
  session.startTransaction();

  ticketTypes = await TicketType.create(req.body, { session: session });

  await session.commitTransaction();
  session.endSession();

 const data = ticketTypes.map((obj) => helper.sanitizeCreatedDoc(obj));

  res.status(200).json({
    status: "success",
    data: data,
  });
});

export const updateOne = catchAsync(async (req, res, next) => {
  let ticketTypes, activityId,features;
  const  updatas=[];

  //檢查每筆資料的 activityId 
  if (Array.isArray(req.body)) {

    //確認新增資料皆為相同活動
    activityId = req.body[0].activityId; // 取得第一筆資料的 activityId

    // 檢查每筆資料的 activityId 是否都與第一筆相同
    const isValidActivityId = req.body.every((data) => data.activityId === activityId);

    if (!isValidActivityId) {
      return res.status(400).json({ error: 'All activityIds must be the same' });
    }
  } 

  //Check activity
  if (!activityId)
    throw errorTable.targetNotProvideError("Activity");

  //3)Update ticketType
  const session = await mongoose.startSession();
  session.startTransaction();

  //更新
  await Promise.all(req.body.map(async (data) => {
    const filter = { activityId: data.activityId, _id: data.id };
    const update = { $set: data };
    const options = { new: true, runValidators: true, session: session };
    const updatedDoc = await TicketType.findOneAndUpdate(filter, update, options);

     features = new queryFeatures(updatedDoc, req.query);
     updatas.push(await features.query);

  if (!updatas) throw errorTable.idNotFoundError();

  }));

  await session.commitTransaction();
  session.endSession();

  res.status(200).json({
    status: "success",
    message: helper.removeDocsObjId(updatas),
  });
});

export const deleteOne = catchAsync(async (req, res, next) => {
  let ticketTypes, activityId,features;

  //檢查每筆資料的 activityId 
  if (Array.isArray(req.body)) {

    //確認新增資料皆為相同活動
    activityId = req.body[0].activityId; // 取得第一筆資料的 activityId

    // 檢查每筆資料的 activityId 是否都與第一筆相同
    const isValidActivityId = req.body.every((data) => data.activityId === activityId);

    if (!isValidActivityId) {
      return res.status(400).json({ error: 'All activityIds must be the same' });
    }
  } 

  //Check activity
  if (!activityId)
    throw errorTable.targetNotProvideError("Activity");

  //3)Update ticketType
const session = await mongoose.startSession();
  session.startTransaction();

  await Promise.all(req.body.map(async (data) => {
    const update = { deletedAt: Date.now() };
    const options = {session: session };
    const updatedDoc = await TicketType.findByIdAndUpdate(data.id, update, options);
  }));
  await session.commitTransaction();
  session.endSession();

  res.status(204).json({});

});
export const checkOwner = catchAsync(async (req, res, next) => {
  let activityId;
  //確認資料為單筆或多筆
  if (Array.isArray(req.body)) {// 多筆資料

    //確認新增資料皆為相同活動
    activityId = req.body[0].activityId; // 取得第一筆資料的 activityId

    // 檢查每筆資料的 activityId 是否都與第一筆相同
    const isValidActivityId = req.body.every((data) => data.activityId === activityId);

    if (!isValidActivityId) {
      return res.status(400).json({ error: 'All activityIds must be the same' });
    }
   } 

  //Find orgid、ownerId
  const activity = await Activity.findById(activityId);
  const orgId = activity.orgId.toString();
  const result = await Org.findById(orgId);

  if (!result._id || !result.ownerId)
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
  if (ownerId.toString() !== user._id.toString()) throw errorTable.noPermissionError();

  next();
});

