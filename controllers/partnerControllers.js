import * as s3 from "../utils/aws/s3.js";
import Partner from "../models/partners.js";
import * as errorTable from "../utils/error/errorTable.js";
import catchAsync from "../utils/error/catchAsync.js";

export const updateIcon = catchAsync(async (req, res, next) => {
  let img;
  if (req.file) {
    // Find the target partner
    const partner = await Partner.findById(req.params.id);
    if (!partner) throw errorTable.idNotFoundError();

    // Update To S3
    try {
      img = await s3.uploadToS3(req.file);
      img = await s3.getFileFromS3(img);
    } catch (err) {
      throw errorTable.idNotFoundError();
    }

    // Update Partner icon
    req.body.icon = img;
  }

  next();
});
