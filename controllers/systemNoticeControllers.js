import mongoose from "mongoose";
import catchAsync from "../utils/error/catchAsync.js";
import queryFeatures from "../utils/helper/queryFeatures.js";
import * as helper from "../utils/helper/helper.js";
import Activity from "../models/activity.js";
import Org from "../models/org.js";
import * as errorTable from "../utils/error/errorTable.js";


export const createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const { title, content, publishAt, ...rest } = req.body;

    // 檢查 title、content 和 publishAt 是否存在
    if (!req.body.title) {
      throw errorTable.targetNotFindError('title');
    }
    if (!req.body.content) {
      throw errorTable.targetNotFindError('content');
    }
    if (!req.body.publishAt) {
      throw errorTable.targetNotFindError('publishAt');
    }

    // 建立新物件
    const newData = { title, content, publishAt, userId, ...rest } ;
    const data = await Model.create(newData);

    res.status(200).json({
      status: "success",
      data: helper.sanitizeCreatedDoc(data),
    });
  });


export const updateOne = (Model) => catchAsync(async (req, res, next) => {

  // 檢查 title、content 和 publishAt 是否存在
  if (!req.body.title) {
    throw errorTable.targetNotFindError('title');
  }
  if (!req.body.content) {
    throw errorTable.targetNotFindError('content');
  }
  
  const noticeId = req.params.newId;
  // 找到該活動消息
  const notice = await Model.findById(noticeId);
  // 如果活動消息不存在，拋出 ID 未找到的錯誤
  if (!notice) {
    throw errorTable.targetNotFindError("noticeId");
  }
    // 驗證是否為該使用者建立的消息
  if (notice.userId.toString() !== req.user.id) {
    throw errorTable.noPermissionError();
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
    throw errorTable.targetNotFindError("noticeId");
  }
    // 驗證是否為該使用者建立的消息
  if (notice.userId.toString() !== req.user.id) {
    throw errorTable.noPermissionError();
  }

  await Model.findByIdAndUpdate(
    req.params.newId,
    { deletedAt: Date.now() },
  );

  res.status(204).json({});
});