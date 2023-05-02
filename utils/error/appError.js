class AppError extends Error {
  constructor(message, statusCode, errorCode) {
    super(message);
    //Http Error Code 4xx: client error, 5xx: server error
    this.status = `${statusCode}`.startsWith("4")
      ? "fail"
      : `${statusCode}`.startsWith("5")
      ? "error"
      : "unknown";

    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = true;

    //Recapture the error stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
