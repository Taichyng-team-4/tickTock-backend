import crypto from "crypto";
import User from "../models/user.js";
import Email from "../utils/email.js";
import * as helper from "../utils/helper/helper.js"
import passwordGenerator from "generate-password";
import catchAsync from "../utils/error/catchAsync.js";
import * as authHelper from "../utils/helper/auth.js";
import * as errorTable from "../utils/error/errorTable.js";

export const authToken = catchAsync(async (req, res, next) => {
  let token;
  // 1) Allow preflight
  if (req.method === "OPTIONS") return next();

  // 2) Get token
  if (authHelper.isTokenExist(req.headers.authorization))
    token = req.headers.authorization.split(" ")[1]; //Authorization: 'Bearer TOKEN
  if (!token) throw errorTable.AuthFailError();

  // 3) Verify token
  const decodeToken = authHelper.decodeJWT(token);

  // 4) Check if User exist
  const user = await User.findById(decodeToken.id);
  if (!user) throw errorTable.AuthFailError();

  // 5) Check if User update his password lately
  if (user.isTokenBeforePasswordUpdate(decodeToken.iat))
    throw errorTable.needToReloginError();

  req.user = user;
  next();
});

export const signup = catchAsync(async (req, res, next) => {
  // 1) Santalize the upcoming request
  const requireFields = [
    "name",
    "gender",
    "birth",
    "country",
    "phone",
    "email",
    "password",
    "passwordConfirm",
  ];

  req.body.birth = authHelper.toUTC(req.body.birth)
  const santalizeResponse = authHelper.santalize(req.body, requireFields);

  // 2) Create email verification secret and token
  const [emailToken, hashEmailToken] = authHelper.createEmailToken();

  // 3) Check if user exist
  const user = await User.findOne({
    email: santalizeResponse.email,
  }).select("+isEmailValidated");

  // 4) If user exist, then check if user email validation
  let newUser;
  if (user && user.isEmailValidated) throw errorTable.emailAlreadyExistError();

  if (user && !user.isEmailValidated) {
    Object.assign(user, {
      ...santalizeResponse,
      emailVerifyToken: hashEmailToken,
    });
    await user.save();
    newUser = user;
  }

  // 5) If user does not exist, then create User
  if (!user) {
    newUser = await User.create({
      ...santalizeResponse,
      emailVerifyToken: hashEmailToken,
    });
  }

  // 6) Create email verification token
  const token = authHelper.createJWT({
    id: newUser._id,
    token: emailToken,
  });

  // 7) Send an verification email
  const email = new Email(newUser.email, newUser.name);
  const verifyUrl =
    process.env.SERVER_URL + `/api/v1/auths/verify_email?token=${token}`;
  await email.sendWelcome(verifyUrl).catch((err) => {
    throw errorTable.sendEmailError();
  });

  // 8) Get User
  newUser = await User.findById(newUser._id).select(
    "-__v -createdAt -updatedAt"
  );

  res.status(201).json({
    status: "succress",
    data: helper.removeDocObjId(newUser),
  });
});

export const verify_email = catchAsync(async (req, res, next) => {
  const token = req.query.token;
  if (!token) throw errorTable.verifyEmailFailError();

  // 1) Verify token
  const decodeToken = authHelper.decodeJWT(token);

  // 2) find User by token
  const user = await User.findById(decodeToken.id).select("+emailVerifyToken");
  if (!user) throw errorTable.verifyEmailFailError();

  // 3) check token
  const hashToken = crypto
    .createHash("sha256")
    .update(decodeToken.token)
    .digest("hex");

  if (hashToken !== user.emailVerifyToken)
    throw errorTable.verifyEmailFailError();

  user.emailVerifyToken = undefined;
  user.emailValidatedAt = Date.now();
  await user.save();

  return res.redirect("https://www.google.com/");
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if user exists by his email
  const user = await User.findOne({
    email,
  }).select("+password +isEmailValidated");
  if (!user) throw errorTable.AuthFailError();

  // 2) Check if user validate his email
  if (!user.isEmailValidated) throw errorTable.notVerifyEmailError();

  // 3) Check user password
  const checkResult = await user.correctPassword(password, user.password);
  if (!checkResult) throw errorTable.AuthFailError();

  // 4) Create jwt token
  const token = authHelper.createJWT({ id: user._id });

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
  const token = authHelper.createJWT({ id: user._id });

  res.status(200).json({
    status: "success",
    token,
    code: "200",
    message: "Update password successfully",
  });
});
