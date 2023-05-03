import AppError from "./appError.js";

export const googleLoginFailError = () =>
  new AppError("Login failed! Please try again later...", 403, "C10010001");

export const emailAlreadyExistError = () =>
  new AppError("Email already exists. Login account instead!", 400, "C10020001");

export const notVerifyEmailError = () =>
  new AppError("Please verify your email first", 400, "G10030001");

export const verifyEmailFailError = () =>
  new AppError(
    "Verify email fail. Signup again or try again later!",
    400,
    "G10020001"
  );

export const sendEmailError = () =>
  new AppError(
    "There was an error sending the email. Try again later!",
    500,
    "B10010001"
  );

export const updatePasswordFailError = () =>
  new AppError(
    "Update password fail! Please try again later",
    400,
    "C10020001"
  );

export const userNotFindError = () =>
  new AppError("Can not find the user!", 404, "C10010003");

export const emailNotFindError = () =>
  new AppError("There is no user with taht email address", 404, "C10010003");

export const needToReloginError = () =>
  new AppError(
    "Change the password recently, Please login again",
    403,
    "A10020001"
  );

export const authTokenErrorHandler = () =>
  new AppError("Authentication fail!", 403, "C10010001");

export const undefinedError = () =>
  new AppError("Unknown error happen!", 500, "F10010001");

export const wrongFormatError = () =>
  new AppError("Unknown error happen!", 500, "F10010001");

export const AuthFailError = () =>
  new AppError("Authentication fail!", 403, "C10010001");

export const validateError = (input) =>
  new AppError(
    `Invalid inputs at ${input}, please check your input is correct.`,
    422
  );

export const castErrorHandler = (err) =>
  new AppError(
    `Field ${err.path} should not be ${err.value}`,
    400,
    "C10020001"
  );

export const duplicateErrorHandler = (err) => {
  const existedFields = Object.keys(err.keyPattern);

  return new AppError(
    `The ${existedFields.join(", ")} already exist...`,
    400,
    "C10010002"
  );
};

export const validateErrorHandler = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  return new AppError(`Invalid input. ${errors.join(". ")}`, 400, "C10020001");
};
