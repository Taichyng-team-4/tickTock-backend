import User from "../models/user.js";
import catchAsync from "../utils/catchAsync.js";
import * as authHelper from "../utils/helper/auth.js";
import * as errorTable from "../utils/table/error.js";

export const getAll = catchAsync(async (req, res, next) => {
  const newUser = await User.find({});

  res.status(201).json({
    status: "succress",
    data: newUser,
  });
});

export const signup = catchAsync(async (req, res, next) => {
  // 1) Santalize the upcoming request
  const requireFields = [
    "firstName",
    "lastName",
    "gender",
    "birth",
    "country",
    "phone",
    "email",
    "password",
    "passwordConfirm",
  ];
  const santalizeResponse = authHelper.santalize(req.body, requireFields);

  // 2) Create User
  const newUser = await User.create(santalizeResponse);

  // 3) Create jwt token
  const token = authHelper.createJWT(newUser._id);

  res.status(201).json({
    status: "succress",
    token,
    data: newUser,
  });
});

export const verify_email = catchAsync((req, res, next) => {
  res.status(200).json({
    status: "success",
    code: "200",
    message: "Validate email successfully!",
  });
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if user exists by his email
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw errorTable.loginFailError();

  // 2) Check user password
  const checkResult = await user.correctPassword(password, user.password);
  if (!checkResult) throw errorTable.loginFailError();

  // 3) Create jwt token
  const token = authHelper.createJWT(user._id);

  res.status(200).json({
    status: "success",
    token,
    code: "200",
    message: "Login account successfully",
  });
});

export const forgotPassword = catchAsync((req, res, next) => {
  res.status(200).json({
    status: "success",
    code: "200",
    message: "New passowrd has sent to your email",
  });
});

export const updatePassword = catchAsync((req, res, next) => {
  res.status(200).json({
    status: "success",
    code: "200",
    message: "Update password successfully",
  });
});
