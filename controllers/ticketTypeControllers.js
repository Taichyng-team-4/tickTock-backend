import catchAsync from "../utils/error/catchAsync.js";

export const getAll = catchAsync((req, res, next) => {
  res.status(200).json({
    code: "200",
    status: "success",
    message: "Get news successfully",
    data: [
      {
        ticketTypeId: "uuid-4445-77IO", //票種id
        ticketTypeName: "一般票", //票種名稱
        ticketTypeArea: "A", //座位區域
        ticketTypeprice: 1000, //票種的價格
        ticketTypeQuota: 100, //票種的總數量
        ticketTypeStartTime: "2023-06-01 17: 00: 00", //票種開售時間
        activityEndTime: "2023/06/03 19: 00: 00", //票種結束時間
      },
      {
        ticketTypeId: "uuid-4445-77I7", //票種id
        ticketTypeName: "早鳥票", //票種名稱
        ticketTypeArea: "A", //座位區域
        ticketTypeprice: 1000, //票種的價格
        ticketTypeQuota: 100, //票種的總數量
        ticketTypeStartTime: "2023-06-01 17: 00: 00", //票種開售時間
        activityEndTime: "2023/06/03 19: 00: 00", //票種結束時間
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
      ticketTypeName: "一般票", //票種名稱
      ticketTypeArea: "A", //座位區域
      ticketTypeprice: 1000, //票種的價格
      ticketTypeQuota: 100, //票種的總數量
      ticketTypeStartTime: "2023-06-01 17: 00: 00", //票種開售時間
      ticketTypeEndTime: "2023/06/03 19: 00: 00", //票種結束時間
      activityId: "uuid-4445-7745", //活動id
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
