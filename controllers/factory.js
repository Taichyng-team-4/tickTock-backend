import * as helper from "../utils/helper/helper.js";
import catchAsync from "../utils/error/catchAsync.js";
import * as errorTable from "../utils/error/errorTable.js";
import queryFeatures from "../utils/helper/queryFeatures.js";

export const getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const features = new queryFeatures(Model.findOne({
      _id: req.params.id,
      deletedAt: { $exists: false } // 添加條件排除已刪除的資料
    }), req.query)
      .select()
      .populate()
      .includeDeleted();

    let data = await features.query;
    if (!data) throw errorTable.idNotFoundError();
    console.log(data)
    if (data.deletedAt) {
      throw new Error("Activity notice not found"); // 如果消息已被刪除，拋出錯誤
    }

    data = helper.removeDocObjId(data);
    if (req.query.pop)
      data = helper.removeFieldsId(data, req.query.pop.split(","));

    res.status(200).json({ status: "success", data });
  });

export const getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const features = new queryFeatures(Model.find(
      { deletedAt: { $exists: false } }), // 添加條件排除已刪除的資料
      req.query)
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

    res.status(200).json({
      status: "success",
      count: data.length,
      data,
    });
  });

export const createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    console.log(req.body)
    const data = await Model.create(req.body);

    res.status(200).json({
      status: "success",
      data: helper.sanitizeCreatedDoc(data),
    });
  });

export const updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const updateQuery = Model.findByIdAndUpdate(req.params.id, req.body, {
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

export const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    await Model.findByIdAndUpdate(req.params.id, { deletedAt: Date.now() });
    res.status(204).json({});
  });
