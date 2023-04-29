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

export const createJWT = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRECT, {
    expiresIn: process.env.JWT_EXPIRED_IN,
  });

export const decodeJWT = (token) => jwt.verify(token, process.env.JWT_SECRECT);

export const isTokenExist = (authorization) =>
  authorization && authorization.startsWith("Bearer");
