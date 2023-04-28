import jwt from "jsonwebtoken";
import * as authHelper from "./auth";
import * as errorTable from "../table/error";
import { beforeAll } from "vitest";

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
    const testId = "testId";
    authHelper.createJWT(testId);
    expect(jwt.sign).toHaveBeenLastCalledWith(
      { id: testId },
      process.env.JWT_SECRECT,
      {
        expiresIn: process.env.JWT_EXPIRED_IN,
      }
    );
  });
});
