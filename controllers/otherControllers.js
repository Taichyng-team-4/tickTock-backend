import FAQ from "../models/faq.js";
import * as s3 from "../utils/aws/s3.js";
import Partner from "../models/partners.js";
import * as helper from "../utils/helper/helper.js";
import catchAsync from "../utils/error/catchAsync.js";
import queryFeatures from "../utils/helper/queryFeatures.js";

export const getHome = catchAsync(async (req, res, next) => {
  const partnerFeatures = new queryFeatures(Partner.find({}), req.query)
    .filter()
    .select();

  let partner = await partnerFeatures.query;
  partner = helper.removeDocsObjId(partner);

  if (req.query.pop)
    partner = partner.map((el) =>
      helper.removeFieldsId(el, req.query.pop.split(","))
    );

  const faqFeatures = new queryFeatures(FAQ.find({}), req.query)
    .filter()
    .select();

  let faqs = await faqFeatures.query;
  faqs = helper.removeDocsObjId(faqs);
  if (req.query.pop)
    faqs = faqs.map((el) =>
      helper.removeFieldsId(el, req.query.pop.split(","))
    );

  res.status(200).json({
    status: "success",
    data: {
      faqs,
      category: ["music", "sport", "drama", "art", "sport", "exhibition"],
      partner,
    },
  });
});

export const updateImg = catchAsync(async (req, res, next) => {
  let img = "";
  if (req.file) {
    // Update To S3
    try {
      img = await s3.uploadToS3(req.file);
      img = await s3.getFileFromS3(img);
    } catch (err) {
      throw errorTable.idNotFoundError();
    }
  }

  res.status(200).json({
    status: "success",
    data: img,
  });
});
