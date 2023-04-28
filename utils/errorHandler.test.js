import { beforeAll } from "vitest";
import * as errorHandler from "./errorHandler";

describe("customErrorHandler()", () => {
  test("should call custom error", () => {
    const error = errorHandler.customErrorHandler();

    expect(error.statusCode).toBe(400);
    expect(error.message).toBe("Your Error Message...");
  });
});

//---------------------------------------------------------------------

describe("devErrorHandler()", () => {
  let res;
  beforeAll(() => {
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
  });

  test("should has response property if mode is dev", () => {
    const err = {
      statusCode: 400,
      status: "fail",
      errorCode: "Test errorCode",
      message: "Test message",
      stack: "Test stack",
      isOperational: true,
    };

    errorHandler.devErrorHandler(err, res);

    expect(res.status).toBeCalledWith(err.statusCode);
    expect(res.json).toBeCalledWith({
      status: err.status,
      error: err,
      errorCode: err.errorCode,
      message: err.message,
      stack: err.stack,
    });
  });
});

//---------------------------------------------------------------------

describe("prodErrorHandler()", () => {
  let res, err;

  beforeAll(() => {
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    err = {
      statusCode: 400,
      status: "fail",
      errorCode: "Test errorCode",
      message: "Test message",
      stack: "Test stack",
      isOperational: true,
    };
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should has response property if error is operational and mode is prod", () => {
    errorHandler.prodErrorHandler(err, res);

    expect(res.status).toBeCalledWith(err.statusCode);
    expect(res.json).toBeCalledWith({
      status: err.status,
      message: err.message,
      errorCode: err.errorCode,
    });
  });

  test("should has response property if error is unknown and mode is prod", () => {
    err.isOperational = false;

    errorHandler.prodErrorHandler(err, res);

    expect(res.status).toBeCalledWith(500);
    expect(res.json).toBeCalledWith({
      status: "error",
      errorCode: "F10010001",
      message: "Unknown error happened...",
    });
  });
});

//---------------------------------------------------------------------

describe("errorHandler()", () => {
  let req, res, err;
  beforeAll(() => {
    req = { file: null };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    err = {
      statusCode: 400,
      status: "fail",
      message: "Test message",
      errorCode: "Test errorCode",
      stack: "Test stack",
      isOperational: true,
    };
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("server mode is 'undefined'", () => {
    beforeAll(() => {
      vi.stubEnv("APP_ENV", "undefined");
    });

    afterAll(() => {
      vi.unstubAllEnvs();
    });

    test("should be 500 error if error is unknown", () => {
      const err = {};

      errorHandler.errorHandler(err, req, res, null);

      expect(err.status).toBe("error");
      expect(err.statusCode).toBe(500);
      expect(err.errorCode).toBe("F10010001");
    });

    test.each([200, 400])(
      "should error statusCode equal to provided statusCode",
      (statusCode) => {
        const err = { statusCode };

        errorHandler.errorHandler(err, req, res, null);

        expect(err.statusCode).toBe(statusCode);
      }
    );
  });

  describe("server mode is 'development' mode", () => {
    beforeAll(() => {
      vi.stubEnv("APP_ENV", "dev");
    });

    afterAll(() => {
      vi.unstubAllEnvs();
    });

    test("should response error with detail", () => {
      errorHandler.errorHandler(err, req, res, null);

      expect(res.status).toBeCalledWith(err.statusCode);
      expect(res.json).toBeCalledWith({
        status: err.status,
        error: err,
        errorCode: err.errorCode,
        message: err.message,
        stack: err.stack,
      });
    });
  });

  describe("server mode is 'production' mode", () => {
    beforeAll(() => {
      vi.stubEnv("APP_ENV", "prod");
    });

    afterAll(() => {
      vi.unstubAllEnvs();
    });

    test("should has response property if error is operational", () => {
      errorHandler.errorHandler(err, req, res, null);

      expect(res.status).toBeCalledWith(err.statusCode);
      expect(res.json).toBeCalledWith({
        status: err.status,
        errorCode: err.errorCode,
        message: err.message,
      });
    });

    test("should has response property if err is unknown", () => {
      err = { ...err, isOperational: false };

      errorHandler.errorHandler(err, req, res, null);

      expect(res.status).toBeCalledWith(500);
      expect(res.json).toBeCalledWith({
        status: "error",
        errorCode: "F10010001",
        message: "Unknown error happened...",
      });
    });

    test("should has response property if error is custom error", () => {
      err = { ...err, name: "CustomErrorChoice" };

      errorHandler.errorHandler(err, req, res, null);

      expect(res.status).toBeCalledWith(400);
      expect(res.json).toBeCalledWith({
        status: "fail",
        errorCode: "your error code",
        message: "Your Error Message...",
      });
    });
  });
});
