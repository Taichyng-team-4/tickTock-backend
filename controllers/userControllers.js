import User from "../models/user.js";
import * as userHelper from "../utils/helper/user.js";
import catchAsync from "../utils/error/catchAsync.js";

export const getMe = catchAsync(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

export const updateOne = catchAsync(async (req, res, next) => {
  const notAllowFields = ["email", "password", "confirmPassword"];
  userHelper.checkUpdateFields(req.body, notAllowFields);

  await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  next();
});

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
