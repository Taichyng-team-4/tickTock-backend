import * as helper from "../utils/helper/helper.js";
import catchAsync from "../utils/error/catchAsync.js";
import * as errorTable from "../utils/error/errorTable.js";

export const getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const data = await Model.findById(req.params.id).select(
      "-createdAt -updatedAt -__v +deletedAt"
    );
    if (!data) throw errorTable.idNotFoundError();

    res
      .status(200)
      .json({ status: "success", data: helper.removeDocRedundantId(data) });
  });

export const getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const data = await Model.find({}, { id: false }).select(
      "-createdAt -updatedAt -__v"
    );

    res.status(200).json({
      status: "success",
      count: data.length,
      data: helper.removeDocsRedundantId(data),
    });
  });

export const createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const data = await Model.create(req.body).select(
      "-createdAt -updatedAt -__v"
    );

    res.status(200).json({
      status: "success",
      data: helper.removeDocRedundantId(data),
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
      data: helper.removeDocRedundantId(data),
    });
  });

export const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    await Model.findByIdAndUpdate(req.params.id, { deletedAt: Date.now() });
    res.status(204).json({});
  });
