import { validationResult } from "express-validator";
import * as errorTable from "../utils/table/error.js";

// Validate the req
export const validation = (req, res, next) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    const invalidFields = result
      .formatWith((error) => error.path)
      .array()
      .join(", ");
    throw errorTable.validateError(invalidFields);
  }
  next();
};
