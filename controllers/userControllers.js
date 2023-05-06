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
