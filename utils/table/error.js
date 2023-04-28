import AppError from "../appError.js";

export const undefinedError = () =>
  new AppError("Unknown error happen!", 500, "F10010001");

export const wrongFormatError = () =>
  new AppError("Unknown error happen!", 500, "F10010001");

export const loginFailError = () =>
  new AppError("Authentication fail!", 401, "C10010001");

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
