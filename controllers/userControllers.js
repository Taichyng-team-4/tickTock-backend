import User from "../models/user.js";
import catchAsync from "../utils/error/catchAsync.js";

export const getOne = catchAsync(async (req, res, next) => {
  const newUser = await User.findById(req.params.id);

  res.status(201).json({
    status: "succress",
    data: newUser,
  });
});

export const getAll = catchAsync(async (req, res, next) => {
  const newUser = await User.find({});

  res.status(201).json({
    status: "succress",
    data: newUser,
  });
});

export const deleteOne = catchAsync(async (req, res, next) => {
  await User.deleteOne({ _id: req.params.id });

  res.status(204).json();
});
