import AppError from "./appError.js";

// Custom Error
export const customErrorHandler = () =>
  new AppError(`Your Error Message...`, 400, "your error code");

// Handle dev error
export const devErrorHandler = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    errorCode: err.errorCode,
    message: err.message,
    stack: err.stack,
  });
};
// Handle prod error
export const prodErrorHandler = (err, res) => {
  //Operational, trusted error: send message
  if (err.isOperational) {
    return res
      .status(err.statusCode)
      .json({
        status: err.status,
        message: err.message,
        errorCode: err.errorCode,
      });
  }

  // Programming or other unknown error: don't leak error details
  res.status(500).json({
    status: "error",
    errorCode: "F10010001",
    message: "Unknown error happened...",
  });
};

export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  err.errorCode = err.errorCode || "F10010001";

  // 1) Remove file
  if (req.file) {
  }

  // 2) Error in development
  if (process.env.APP_ENV === "dev") devErrorHandler(err, res);

  // 3) Error in production
  if (process.env.APP_ENV === "prod") {
    let customError = { ...err };
    customError.message = err.message;

    if (customError.name === "CustomErrorChoice")
      customError = customErrorHandler(customError);

    prodErrorHandler(customError, res);
  }
};
