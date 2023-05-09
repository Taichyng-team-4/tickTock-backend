import catchAsync from "../utils/error/catchAsync.js";

export const getOne = (Model, select) =>
  catchAsync(async (req, res, next) => {
    const data = await Model.findById(req.params.id, select);

    res.status(200).json({
      code: 200,
      status: "success",
      data,
    });
  });
export const getAll = catchAsync((req, res, next) => {});
export const createOne = catchAsync((req, res, next) => {});
export const updateOne = catchAsync((req, res, next) => {});
export const deleteOne = catchAsync((req, res, next) => {});
