import Org from "../models/org.js";
import * as helper from "../utils/helper/helper.js";
import catchAsync from "../utils/error/catchAsync.js";
import * as errorTable from "../utils/error/errorTable.js";

export const createOne = catchAsync(async (req, res, next) => {
  const data = await Org.create({ ...req.body, ownerId: req.user.id });

  res.status(200).json({
    status: "success",
    data: helper.sanitizeCreatedDoc(data),
  });
});

export const checkOwner = catchAsync(async (req, res, next) => {
  const org = await Org.findById(req.params.id);
  
  if (!org) throw errorTable.targetNotFoundError("Organization");
  if (org.ownerId.toString() !== req.user.id)
    throw errorTable.noPermissionError();

  next();
});
