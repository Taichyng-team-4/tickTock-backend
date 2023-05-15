import * as errorHandler from "./errorHandler";

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
      code: err.statusCode,
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
      code: err.statusCode,
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
      code: 500,
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
  });

  beforeEach(() => {
    err = {
      statusCode: 400,
      status: "fail",
      message: "Test message",
      errorCode: "Test errorCode",
      stack: "Test stack",
      isOperational: true,
    };
    vi.clearAllMocks();
  });

  describe("server mode is 'undefined'", () => {
    beforeAll(() => {
      vi.stubEnv("APP_ENV", "undefined");
    });

    afterAll(() => {
      vi.unstubAllEnvs();
    });

    test("should http error code equal to 500 if error is unknown", () => {
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

    test("should response error has property", () => {
      errorHandler.errorHandler(err, req, res, null);

      expect(res.status).toBeCalledWith(err.statusCode);
      expect(res.json).toBeCalledWith({
        status: err.status,
        error: err,
        code: err.statusCode,
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
        code: err.statusCode,
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
        code: 500,
        errorCode: "F10010001",
        message: "Unknown error happened...",
      });
    });

    test("should has response property if error is cast error", () => {
      err = { ...err, name: "CastError", path: "testPath", value: "testValue" };

      errorHandler.errorHandler(err, req, res, null);

      expect(res.status).toBeCalledWith(400);
      expect(res.json).toBeCalledWith({
        code: err.statusCode,
        status: "fail",
        errorCode: "C10020001",
        message: `Field ${err.path} should not be ${err.value}`,
      });
    });

    test("should has response property if error is duplicate error", () => {
      err = {
        ...err,
        code: 11000,
        keyPattern: { duplicateKey1: "value1", duplicateKey2: "value2" },
      };

      errorHandler.errorHandler(err, req, res, null);

      expect(res.status).toBeCalledWith(400);
      expect(res.json).toBeCalledWith({
        code: err.statusCode,
        status: "fail",
        errorCode: "C10010002",
        message: "The duplicateKey1, duplicateKey2 already exist...",
      });
    });

    test("should has response property if error is validation error", () => {
      err = {
        ...err,
        name: "ValidationError",
        errors: [{ message: "testMessage1" }, { message: "testMessage2" }],
      };

      errorHandler.errorHandler(err, req, res, null);

      expect(res.status).toBeCalledWith(400);
      expect(res.json).toBeCalledWith({
        code: err.statusCode,
        status: "fail",
        errorCode: "C10020001",
        message: `Invalid input. testMessage1. testMessage2`,
      });
    });
  });
});
