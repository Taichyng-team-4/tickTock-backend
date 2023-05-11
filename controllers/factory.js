import * as helper from "../utils/helper/helper.js";
import catchAsync from "../utils/error/catchAsync.js";
import * as errorTable from "../utils/error/errorTable.js";
import queryFeatures from "../utils/helper/queryFeatures.js";

export const getOne = (Model, populate) =>
  catchAsync(async (req, res, next) => {
    const features = new queryFeatures(Model.findById(req.params.id), req.query)
      .select()
      .includeDeleted();
    const data = await features.query;
    if (!data) throw errorTable.idNotFoundError();

    res
      .status(200)
      .json({ status: "success", data: helper.removeDocObjId(data) });
  });

export const getAll = (Model, populate) =>
  catchAsync(async (req, res, next) => {
    const features = new queryFeatures(Model.find({}), req.query)
      .select()
      .sort()
      .paginate()
      .includeDeleted();
    const data = await features.query;

    res.status(200).json({
      status: "success",
      count: data.length,
      data: helper.removeDocsObjId(data),
    });
  });

export const createOne = (Model) =>
  catchAsync(async (req, res, next) => {
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
    const features = new queryFeatures(updateQuery).select();

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
