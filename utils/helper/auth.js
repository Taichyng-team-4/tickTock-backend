import crypto from "crypto";
import jwt from "jsonwebtoken";
import * as errorTable from "../table/error.js";

export const santalize = (obj, fields) => {
  let newObj = {};
  if (!obj) throw errorTable.undefinedError();
  if (!Array.isArray(fields)) throw errorTable.wrongFormatError();

  Object.keys(obj).forEach((key) => {
    if (fields.includes(key)) newObj[key] = obj[key];
  });

  return newObj;
};

export const createJWT = (obj) =>
  jwt.sign(obj, process.env.JWT_SECRECT, {
    expiresIn: process.env.JWT_EXPIRED_IN,
  });

export const decodeJWT = (token) => jwt.verify(token, process.env.JWT_SECRECT);

export const isTokenExist = (authorization) =>
  !!(
    authorization &&
    authorization.startsWith("Bearer") &&
    authorization.split(" ")[1]
  );

export const createEmailToken = () => {
  const token = crypto.randomBytes(32).toString("hex");
  const hash = crypto.createHash("sha256").update(token).digest("hex");

  return [token, hash];
};

export const isSameToken = (token1, token2) => token1 === token2;
