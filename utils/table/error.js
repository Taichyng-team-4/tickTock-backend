import AppError from "../appError.js";

export const undefinedError = () =>
  new AppError("Unknown error happen!", 500, "F10010001");

export const wrongFormatError = () =>
  new AppError("Unknown error happen!", 500, "F10010001");

export const loginFailError = () =>
  new AppError("Authentication fail!", 401, "C10010001");

export const validateError = (input) =>
  new AppError(`Invalid inputs at ${input}, please check your input is correct.`, 422);
