import catchAsync from "../utils/error/catchAsync.js";
import queryFeatures from "../utils/helper/queryFeatures.js";
import * as helper from "../utils/helper/helper.js";

export const updateOne = (Model) =>catchAsync(async (req, res, next) => {
  var paramt = ''
  if (req.params.newid!=''){
    paramt=req.params.newid
  }
  if (req.params.systemid!=''){
    paramt=req.params.systemid
  }
  const updateQuery = Model.findByIdAndUpdate(paramt, req.body, {
    new: true,
    runValidators: true,
  });
  const features = new queryFeatures(updateQuery, req.query).select();
  const data = await features.query;
  // console.log(data)
  if (!data) throw errorTable.idNotFoundError();

  res.status(200).json({
    status: "success",
    data: helper.removeDocObjId(data),
  });
});

export const deleteOne = (Model) => catchAsync(async (req, res, next) => {
  let paramt = ''
  if (req.params.newid!=''){
    paramt=req.params.newid
  }
  if (req.params.systemid!=''){
    paramt=req.params.systemid
  }
  await Model.findByIdAndUpdate(paramt, { deletedAt: Date.now() });
  res.status(204).json({});
});
