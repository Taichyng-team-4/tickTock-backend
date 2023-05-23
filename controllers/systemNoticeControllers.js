import mongoose from "mongoose";
import catchAsync from "../utils/error/catchAsync.js";
import queryFeatures from "../utils/helper/queryFeatures.js";
import * as helper from "../utils/helper/helper.js";
import Activity from "../models/activity.js";
import Org from "../models/org.js";


export const updateOne = (Model) => catchAsync(async (req, res, next) => {

  // 取得要更新的活動消息的 ID
  const noticeId = req.params.newId;
  // 找到該活動消息
  const notice = await Model.findById(noticeId);
  // 如果活動消息不存在，拋出 ID 未找到的錯誤
  if (!notice) {
    throw errorTable.targetNotFindError("activity");
  }

  // 取得要更新的活動消息的 ID
  const orgId = req.body.orgId;
  // 找到該活動所屬的組織
  const organization = await Org.findById(orgId);
  // 如果組織不存在或使用者不是該組織的擁有者，拋出錯誤
  if (!organization) {
    throw errorTable.noticeNotFindError();
  }

  // 更新活動消息
  const updateQuery = Model.findByIdAndUpdate(noticeId, req.body, {
    new: true,
    runValidators: true,
  });

  const features = new queryFeatures(updateQuery, req.query).select();
  const data = await features.query;

  if (!data) throw errorTable.idNotFoundError();

  res.status(200).json({
    status: "success",
    data: helper.removeDocObjId(data),
  });
});

export const deleteOne = (Model) => catchAsync(async (req, res, next) => {
  
  const noticeId = req.params.newId;
  const notice = await Model.findById(noticeId);
  if (!notice) {
    throw errorTable.targetNotFindError("activity");
  }

  const orgId = req.body.orgId;
  const organization = await Org.findById(orgId);
  if (!organization) {
      throw errorTable.noticeNotFindError();
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  await Model.findByIdAndUpdate(
    req.params.newId,
    { deletedAt: Date.now() },
    { session: session }
  );
  await session.commitTransaction();
  session.endSession();

  res.status(204).json({});
});