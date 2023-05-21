import * as userHelper from "../utils/helper/user.js";
import catchAsync from "../utils/error/catchAsync.js";

export const getMe = catchAsync(async (req, res, next) => {
  console.log(req.params.id, req.user._id)
  req.params.id = req.user._id;
  next();
});

export const getProfile = catchAsync(async (req, res, next) => {
  req.query.fields = "+email,+name,+gender,+phone,+birth,+avatar";
  next();
});

export const checkUpdatedProfile = catchAsync(async (req, res, next) => {
  const notAllowFields = ["email", "password", "confirmPassword"];
  userHelper.checkUpdateFields(req.body, notAllowFields);
  next();
});
