import passwordGenerator from "generate-password";
import User from "../models/user.js";
import Email from "../utils/email.js";
import catchAsync from "../utils/error/catchAsync.js";
import * as authHelper from "../utils/helper/auth.js";
import * as errorTable from "../utils/table/error.js";

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

//Verify Json Web Token
export const authToken = catchAsync(async (req, res, next) => {
  let token;
  // 1) Allow preflight
  if (req.method === "OPTIONS") return next();

  // 2) Get token
  if (authHelper.isTokenExist(req.headers.authorization))
    token = req.headers.authorization.split(" ")[1]; //Authorization: 'Bearer TOKEN
  if (!token) throw errorTable.loginFailError();

  // 3) Verify token
  const decodeToken = authHelper.decodeJWT(token);

  // 4) Check if User exist
  const user = await User.findById(decodeToken.id);
  if (!user) throw errorTable.loginFailError();

  // 5) Check if User update his password lately
  if (user.isTokenBeforePasswordUpdate(decodeToken.iat))
    throw errorTable.needToReloginError();

  req.user = user;
  next();
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

export const forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Check if User exist
  const user = await User.findOne({ email: req.body.email }).select("+email");
  if (!user) throw errorTable.emailNotFindError();

  // 2) Generate new Password
  const newPassword = passwordGenerator.generate({
    length: 15,
    numbers: true,
    symbols: true,
  });

  // 3) Save the user password
  user.password = newPassword;
  user.emailValidatedAt = Date.now();
  await user.save();

  // 4) Send new Password to User email
  const email = new Email(user.email, user.name);
  const message = `<p>Your new password is</p>` + `<h2>${newPassword}</h2>`;
  await email.send("Reset Password", message).catch((err) => {
    console.log(err)
    throw errorTable.sendEmailError();
  });

  res.status(200).json({
    status: "success",
    code: "200",
    message:
      "Reset password successfully, New password has sent to your email!",
  });
});

export const updatePassword = catchAsync(async (req, res, next) => {
  const { oldPassword, password, passwordConfirm } = req.body;

  // 1) Get User
  const user = await User.findById(req.user._id).select("+password");
  if (!user) throw errorTable.userNotFindError();

  // 2) Check user password
  const checkResult = await user.correctPassword(oldPassword, user.password);
  if (!checkResult) throw errorTable.updatePasswordFailError();

  // 3) Save user
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  await user.save();

  // 4) Create jwt token
  const token = authHelper.createJWT(user._id);

  res.status(200).json({
    status: "success",
    token,
    code: "200",
    message: "Update password successfully",
  });
});
