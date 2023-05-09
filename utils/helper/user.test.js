import * as userHelper from "../helper/user";
import * as errorTable from "../error/errorTable";

describe("isProfileOwner()", () => {
  test("should return true if the userId match", () => {
    expect(userHelper.isProfileOwner("userId", "userId")).toBe(true);
  });
  test("should return false if the userId does not match", () => {
    expect(userHelper.isProfileOwner("userId", "notSameUserId")).toBe(false);
  });
});

describe("checkUpdateFields()", () => {
  test("should throw error if the query has keys in notAllowFields", () => {
    const wrongField = ["email"];
    const query = { email: "testEmail" };
    const notAllowFields = ["email"];

    expect(() => userHelper.checkUpdateFields(query, notAllowFields)).toThrow(
      errorTable.notAllowUpdateError(wrongField)
    );
  });
  test("should not throw error if the query does not have keys in notAllowFields", () => {
    const query = {};
    const notAllowFields = ["email"];

    expect(() =>
      userHelper.checkUpdateFields(query, notAllowFields)
    ).not.toThrow();
  });
});
