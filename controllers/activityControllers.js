import catchAsync from "../utils/error/catchAsync.js";

export const getAll = catchAsync((req, res, next) => {
  res.status(200).json({
    code: "200",
    status: "success",
    message: "Get news successfully",
    data: [
      {
        activityId: "uuid-4445-7745", //活動id
        activityName: "2023年春季文藝晚會", //活動標題
        activityStartTime: "2023-05-15 19:00:00", //活動開始時間
        activityEndTime: "2023/06/03 19:00:00", //活動結束時間
        activityMaxCapacity: 200, //活動上限人數
        activityNumberOfApplicants: 200, //報名人數
        activityTicketStatus: 0, //購票狀態:0:未發布 1:發佈
        orgId: "uuid-12345-23456-111", //組織id
        activityStatus: 0, //活動是否已結束:0:未結束 1:已結束
      },
      {
        activityId: "uuid-4445-7746", //活動id
        activityName: "2023年XX晚會", //活動標題
        activityStartTime: "2023-05-15 19:00:00", //活動開始時間
        activityEndTime: "2023/06/03 19:00:00", //活動結束時間
        activityMaxCapacity: 200, //活動上限人數
        activityNumberOfApplicants: 200, //報名人數
        activityTicketStatus: 0, //購票狀態:0:未發布 1:發佈
        orgId: "uuid-12345-23456-112", //組織id
        activityStatus: 0, //活動是否已結束:0:未結束 1:已結束
      },
    ],
  });
});

export const getOne = catchAsync((req, res, next) => {
  res.status(200).json({
    code: "200",
    status: "success",
    message: "Get news successfully",
    data: {
      activityId: "uuid-4445-7745", //活動id
      activityName: "2023年春季文藝晚會", //活動標題
      activityStartTime: "2023-05-15 19:00:00", //活動開始時間
      activityEndTime: "2023/06/03 19:00:00", //活動結束時間
      activityMaxCapacity: 200, //活動上限人數
      activityNumberOfApplicants: 200, //報名人數
      activityTicketStatus: 0, //購票狀態:0:未發布 1:發佈
      orgId: "uuid-12345-23456-111", //組織id
      activityStatus: 0, //活動是否已結束:0:未結束 1:已結束
    },
  });
});

export const createOne = catchAsync((req, res, next) => {
  res.status(201).json({
    code: "201",
    status: "success",
    message: "Added information successfully",
  });
});

export const updateOne = catchAsync((req, res, next) => {
  res.status(200).json({
    code: "201",
    status: "success",
    message: "Updating information successfully",
  });
});

export const deleteOne = catchAsync((req, res, next) => {
  res.status(201).json({
    code: "201",
    status: "success",
    message: "Data deleted successfully",
  });
});

export const getStatistics = catchAsync((req, res, next) => {
  res.status(201).json({
    code: "200",
    status: "success",
    activityId: "uuid",
    publish: 0,
    ticket: [
      {
        name: "早鳥票",
        start: "2023/01/03",
        end: "2023/01/25",
        price: 1600,
        state: "已結束",
        quantity: "總票數量",
        totalSold: "銷售總數量",
        refund: "退票量",
      },
    ],
    saleMethod: [
      {
        area: "A區域",
        start: "2023/01/03",
        end: "2023/01/25",
        ticket: "早鳥票",
        sold: "售出量",
      },
    ],
    ageRange: [
      {
        age: "男",
        sold: [
          {
            range: "18-25",
            sold: "售出量",
            amount: "銷售總金額",
          },
        ],
      },
      {
        age: "女",
        sold: [
          {
            range: "18-25",
            sold: "售出量",
            amount: "銷售總金額",
          },
        ],
      },
    ],
    dailySales: [
      { date: "2023/01/03", totalSold: "銷售總數量", amount: "銷售總金額" },
    ],
  });
});
