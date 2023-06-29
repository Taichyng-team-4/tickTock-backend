import FAQ from "../models/faq.js";
import * as s3 from "../utils/aws/s3.js";
import Partner from "../models/partners.js";
import systemNotice from "../models/systemNotice.js";
import activityNotice from "../models/activityNotice.js";
import * as helper from "../utils/helper/helper.js";
import catchAsync from "../utils/error/catchAsync.js";
import * as errorTable from "../utils/error/errorTable.js";
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

  const activityNoticeFeatures = new queryFeatures(
    activityNotice.find({ expiredAt: { $gte: Date.now() } }),
    req.query
  )
    .filter()
    .select();

  let activityNotices = await activityNoticeFeatures.query;
  activityNotices = helper.removeDocsObjId(activityNotices);
  if (req.query.pop)
    activityNotices = activityNotices.map((el) =>
      helper.removeFieldsId(el, req.query.pop.split(","))
    );

  const systemNoticeFeatures = new queryFeatures(
    systemNotice.find({ expiredAt: { $gte: Date.now() } }),
    req.query
  )
    .filter()
    .select();

  let systemNotices = await systemNoticeFeatures.query;
  systemNotices = helper.removeDocsObjId(systemNotices);
  if (req.query.pop)
    systemNotices = systemNotices.map((el) =>
      helper.removeFieldsId(el, req.query.pop.split(","))
    );
  // faqs,
  // category: ["music", "sport", "drama", "art", "sport", "exhibition"],
  // partner,
  res.status(200).json({
    status: "success",
    data: {
      notice: {
        activity: {
          count: activityNotices.length,
          data: activityNotices,
        },
        system: {
          count: systemNotices.length,
          data: systemNotices,
        },
      },
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
      console.log(err)
      throw errorTable.idNotFoundError();
    }
  }

  res.status(200).json({
    status: "success",
    data: img,
  });
});
