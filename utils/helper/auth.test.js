import crypto from "crypto";
import jwt from "jsonwebtoken";
import * as authHelper from "./auth";
import * as errorTable from "../table/error";
import { beforeAll, beforeEach, describe, test } from "vitest";

describe("santalize()", () => {
  test("should throw error if object does not exist", () => {
    expect(() => authHelper.santalize()).toThrow(errorTable.undefinedError());
  });

  test("should throw error if fields is not an array", () => {
    const obj = {};
    const fields = "testFields";

    expect(() => authHelper.santalize(obj, fields)).toThrow(
      errorTable.wrongFormatError()
    );
  });

  test("should not throw error if fields is an array", () => {
    const obj = {};
    const fields = [];

    expect(() => authHelper.santalize(obj, fields)).not.toThrow();
  });

  test("should santalize obj by provided field", () => {
    let result;
    const obj = { key1: "value1", key2: "value2" };
    const fields = ["key1"];

    try {
      result = authHelper.santalize(obj, fields);
    } catch (err) {}

    expect(result).toEqual({ key1: "value1" });
  });
});

describe("createJWT()", () => {
  beforeAll(() => {
    vi.spyOn(jwt, "sign").mockImplementation(() => {});
    vi.stubEnv("JWT_SECRECT", "testSecrect");
    vi.stubEnv("JWT_EXPIRED_IN", "1d");
  });

  test("should create the jwt by id", () => {
    const obj = { id: "testId" };
    authHelper.createJWT(obj);
    expect(jwt.sign).toHaveBeenLastCalledWith(
      { id: "testId" },
      process.env.JWT_SECRECT,
      {
        expiresIn: process.env.JWT_EXPIRED_IN,
      }
    );
  });
});

describe("decodeJWT()", () => {
  beforeAll(() => {
    vi.stubEnv("JWT_SECRECT", "test_JWT_SECRECT");
    vi.spyOn(jwt, "verify").mockImplementation(() => {});
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should decode the token by the server jwt secret key", () => {
    const token = "testToken";
    const decodeToken = "decodeToken";
    jwt.verify.mockImplementationOnce(() => decodeToken);

    const result = authHelper.decodeJWT(token);

    expect(jwt.verify).toHaveBeenLastCalledWith(token, process.env.JWT_SECRECT);
    expect(result).toBe(decodeToken);
  });
});

describe("isTokenExist()", () => {
  test("should return false if the input authorization does not exist in the header", () => {
    const result = authHelper.isTokenExist();

    expect(result).toBe(false);
  });

  test("should return false if Bearer does not exist in the header authorization", () => {
    const authorization = "test";

    const result = authHelper.isTokenExist(authorization);

    expect(result).toBe(false);
  });

  test("should return false if bearer token does not exist in header", () => {
    const authorization = "Bearer";

    const result = authHelper.isTokenExist(authorization);

    expect(result).toBe(false);
  });

  test("should return true if bearer token exists in header", () => {
    const authorization = "Bearer testToken";

    const result = authHelper.isTokenExist(authorization);

    expect(result).toBe(true);
  });
});

describe("createEmailToken()", () => {
  test("should return the token and hashToken", () => {
    const [token, hashToken] = authHelper.createEmailToken();

    expect(token).not.toBeUndefined();
    expect(hashToken).not.toBeUndefined();
  });

  test("should the token equal to the hashToken if the token hash", () => {
    const [token, hashToken] = authHelper.createEmailToken();
    const hash = crypto.createHash("sha256").update(token).digest("hex");

    expect(hash).toBe(hashToken);
  });
});
