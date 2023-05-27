import catchAsync from "../utils/error/catchAsync.js";
import queryFeatures from "../utils/helper/queryFeatures.js";
import * as helper from "../utils/helper/helper.js";
import Activity from "../models/activity.js";
import Org from "../models/org.js";
import * as errorTable from "../utils/error/errorTable.js";
import ActivityNotice from "../models/activityNotice.js";

export const createOne = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const { activityId } = req.body;

  // 檢查是否提供了有效的 activityId
  if (!activityId) throw errorTable.targetNotFoundError("activityId");

  // 在這裡進行查詢，確認 activityId 是否存在於 activity 資料表中
  const activity = await Activity.findById(activityId);

  // 如果 activityId 對應的活動不存在，則拋出一個錯誤
  if (!activity) throw errorTable.targetNotFindError("activity");

  // 找到該活動所屬的組織
  const organization = await Org.findOne({
    ownerId: userId,
    _id: activity.orgId,
  });

  // 如果組織不存在或使用者不是該組織的擁有者，拋出錯誤
  if (!organization) throw errorTable.noPermissionError();

  // Change the them to local
  req.body.publishAt = helper.toLocalTime(req.body.publishAt);
  req.body.expiredAt = helper.toLocalTime(req.body.expiredAt);

  // 建立包含 activityId 的新物件
  const data = await ActivityNotice.create(req.body);

  res.status(200).json({
    status: "success",
    data: helper.sanitizeCreatedDoc(data),
  });
});

export const updateOne = catchAsync(async (req, res, next) => {
  // 取得要更新的活動消息的 ID
  const noticeId = req.params.id;
  // 找到該活動消息
  const notice = await ActivityNotice.findById(noticeId);
  // 如果活動消息不存在，拋出 ID 未找到的錯誤
  if (!notice) {
    throw errorTable.targetNotFindError("activity");
  }

  // 取得活動
  const activity = await Activity.findById(notice.activityId);
  // 取得使用者ID
  const userId = req.user.id;
  // 找到該活動所屬的組織
  const organization = await Org.findOne({
    ownerId: userId,
    _id: activity.orgId,
  });
  // 如果組織不存在或使用者不是該組織的擁有者，拋出錯誤
  if (!organization) {
    throw errorTable.noPermissionError();
  }

  // 更新活動消息
  const updateQuery = ActivityNotice.findByIdAndUpdate(noticeId, req.body, {
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

export const deleteOne = catchAsync(async (req, res, next) => {
  const noticeId = req.params.id;
  const notice = await ActivityNotice.findById(noticeId);
  if (!notice) {
    throw errorTable.targetNotFindError("activity");
  }

  // 取得活動
  const activity = await Activity.findById(notice.activityId);
  // 取得使用者ID
  const userId = req.user.id;
  // 找到該活動所屬的組織
  const organization = await Org.findOne({
    ownerId: userId,
    _id: activity.orgId,
  });
  if (!organization) {
    throw errorTable.noPermissionError();
  }

  await ActivityNotice.findByIdAndUpdate(req.params.id, {
    deletedAt: Date.now(),
  });

  res.status(204).json({});
});
