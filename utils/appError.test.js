import AppError from "./appError";

describe("AppError", () => {
  let message, statusCode, errorCode;
  beforeEach(() => {
    message = "testMessage";
    statusCode = "testStatusCode";
    errorCode = "testErrorCode";
  });

  test("should error message equal to provided message", () => {
    const appError = new AppError(message, statusCode, errorCode);
    expect(appError.message).toBe(message);
  });

  test("should error statusCode equal to provided statusCode", () => {
    const appError = new AppError(message, statusCode, errorCode);
    expect(appError.statusCode).toBe(statusCode);
  });

  test("should error statusCode equal to provided statusCode", () => {
    const appError = new AppError(message, statusCode, errorCode);
    expect(appError.errorCode).toBe(errorCode);
  });

  test("should be operational error", () => {
    const appError = new AppError(message, statusCode, errorCode);
    expect(appError.isOperational).toBe(true);
  });

  test("should be fail status if statusCode startwith 4xx", () => {
    const appError = new AppError(message, 400, errorCode);
    expect(appError.status).toBe("fail");
  });

  test("should be error status if statusCode startwith 5xx", () => {
    const appError = new AppError(message, 500, errorCode);
    expect(appError.status).toBe("error");
  });

  test("should be unknown status if statusCode startwith 5xx", () => {
    const appError = new AppError(message, 600, errorCode);
    expect(appError.status).toBe("unknown");
  });
});
