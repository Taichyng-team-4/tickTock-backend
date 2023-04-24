class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    //Http Error Code 4xx: client error, 5xx: server error
    this.status = `${statusCode}`.startsWith("4")
      ? "fail"
      : `${statusCode}`.startsWith("5")
      ? "error"
      : "unknown status";

    this.statusCode = statusCode;
    this.isOperational = true;

    //Recapture the error stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
