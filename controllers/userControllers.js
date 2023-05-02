import catchAsync from "../utils/error/catchAsync.js";

export const signup = catchAsync((req, res, next) => {
  res.status(201).json({
    status: "success",
    code: "201",
    message: "Sign up account successfully",
  });
});

export const verify_email = catchAsync((req, res, next) => {
  res.status(200).json({
    status: "success",
    code: "200",
    message: "Validate email successfully!",
  });
});

export const login = catchAsync((req, res, next) => {
  res.status(200).json({
    status: "success",
    code: "200",
    message: "Login account successfully",
    token: "yourToken",
  });
});

export const profile = catchAsync((req, res, next) => {
  res.status(200).json({
    status: "success",
    code: "200",
    message: "Update account successfully",
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
