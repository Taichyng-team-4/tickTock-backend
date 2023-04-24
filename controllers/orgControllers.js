import catchAsync from "../utils/catchAsync.js";

export const getAll = catchAsync((req, res, next) => {
  res.status(200).json({
    code: "200",
    status: "success",
    data: [
      {
        orgId: "uuid-12345-23456-111", // 組織 UUID <文字型態>
        orgName: "組織名稱#1", // 組織名稱 <文字型態>
        orgEmail: "aaa@bbb.ccc", // 組織 email <文字型態>
        orgPhone: "04-234567890", // 組織 電話 <文字型態>
        orgPhoneExt: "3333", // 組織 電話分機 <文字型態>
      },
      {
        orgId: "uuid-12345-23456-222", // 組織 UUID <文字型態>
        orgName: "組織名稱#2", // 組織名稱 <文字型態>
        orgEmail: "aaa@bbb222.ccc", // 組織 email <文字型態>
        orgPhone: "04-234567892", // 組織 電話 <文字型態>
        orgPhoneExt: "4444", // 組織 電話分機 <文字型態>
      },
    ],
  });
});

export const getOne = catchAsync((req, res, next) => {
  res.status(200).json({
    code: "200",
    status: "success",
    data: {
      orgId: "uuid-12345-23456-111", // 組織 UUID <文字型態>
      orgName: "組織名稱#1", // 組織名稱 <文字型態>
      orgEmail: "aaa@bbb.ccc", // 組織 email <文字型態>
      orgPhone: "04-234567890", // 組織 電話 <文字型態>
      orgPhoneExt: "3333", // 組織 電話分機 <文字型態>
      orgImageUrl: "https://www.imgur.com/aaa/bbb/ccc.png", // 組織圖示位置 <文字型態>
      orgContents: "我是組織內容資訊xxxxx", // 組織內容資訊<文字型態>
    },
  });
});

export const createOne = catchAsync((req, res, next) => {
  res.status(201).json({
    orgName: "組織名稱#1", // 組織名稱 <文字型態>
    orgEmail: "aaa@bbb.ccc", // 組織 email <文字型態>
    orgPhone: "04-234567890", // 組織 電話 <文字型態>
    orgPhoneExt: "3333", // 組織 電話分機 <文字型態>
    orgImageUrl: "https://www.imgur.com/aaa/bbb/ccc.png", // 組織圖示位置 <文字型態>
    orgContents: "我是組織內容資訊xxxxx", // 組織內容資訊<文字型態>
  });
});

export const updateOne = catchAsync((req, res, next) => {
  res.status(200).json({
    orgName: "組織名稱#1", // 組織名稱 <文字型態>
    orgEmail: "aaa@bbb.ccc", // 組織 email <文字型態>
    orgPhone: "04-234567890", // 組織 電話 <文字型態>
    orgPhoneExt: "3333", // 組織 電話分機 <文字型態>
    orgImageUrl: "https://www.imgur.com/aaa/bbb/ccc.png", // 組織圖示位置 <文字型態>
    orgContents: "我是組織內容資訊xxxxx", // 組織內容資訊<文字型態>
  });
});

export const deleteOne = catchAsync((req, res, next) => {
  res.status(201).json({
    code: "201",
    status: "success",
    message: "刪除組織資料成功",
  });
});
