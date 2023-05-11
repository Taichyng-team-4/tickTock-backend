import * as helper from "../utils/helper/helper.js";
import catchAsync from "../utils/error/catchAsync.js";
import * as errorTable from "../utils/error/errorTable.js";

export const getOne = (Model, populate) =>
  catchAsync(async (req, res, next) => {
    const data = await helper.getFindByIdQuery({
      Model,
      id: req.params.id,
      populate,
    });
    if (!data) throw errorTable.idNotFoundError();

    res
      .status(200)
      .json({ status: "success", data: helper.removeDocObjId(data) });
  });

export const getAll = (Model, populate) =>
  catchAsync(async (req, res, next) => {
    const data = await helper.getFindQuery({ Model, populate });

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
    const data = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).select("-createdAt -updatedAt -__v");
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

// ------------------------------------------------------------------------------------

export const getOneWithDeleted = (Model, populate) =>
  catchAsync(async (req, res, next) => {
    const data = await helper.getFindByIdQueryWithDeleted({
      Model,
      id: req.params.id,
      populate,
    });
    if (!data) throw errorTable.idNotFoundError();

    res
      .status(200)
      .json({ status: "success", data: helper.removeDocObjId(data) });
  });

export const getAllWithDeleted = (Model, populate) =>
  catchAsync(async (req, res, next) => {
    const data = await helper.getFindQueryWithDeleted({ Model, populate });

    res.status(200).json({
      status: "success",
      count: data.length,
      data: helper.removeDocsObjId(data),
    });
  });
