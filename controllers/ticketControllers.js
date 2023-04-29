import catchAsync from "../utils/error/catchAsync.js";

export const getAll = catchAsync((req, res, next) => {
  res.status(200).json({
    status: "success",
    code: "200",
    message: "Get tickets successfully",
    data: [
      {
        ticketId: "643adabe75cf2e2f24a07b03",
        isRefunded: true,
        ticketSellDate: "1997-01-01",
        ticketReturnDate: "1997-01-01",
        orderId: "643adabe75cf2e2f24a07b03",
        activity: {
          activityID: "643adabe75cf2e2f24a07b03",
          isEnd: false,
          loc: "No. 45 , City Hall Rd, Xinyi District, Taipei City, 110",
          activityStartDate: "1997-01-01",
          activityEndDate: "1997-01-01",
        },
        ticketArea: "A",
        ticketType: "Early bird",
        ticketSeat: "H5B22",
        ticketPrice: "NT$123",
        ticketQrCode: "ticketQrCode",
      },
    ],
  });
});

export const getOne = catchAsync((req, res, next) => {
  res.status(200).json({
    status: "success",
    code: "200",
    message: "Get ticket successfully",
    data: {
      ticketId: "643adabe75cf2e2f24a07b03",
      isRefunded: true,
      ticketSellDate: "1997-01-01",
      ticketReturnDate: "1997-01-01",
      orderId: "643adabe75cf2e2f24a07b03",
      activity: {
        activityID: "643adabe75cf2e2f24a07b03",
        isEnd: false,
        loc: "No. 45 , City Hall Rd, Xinyi District, Taipei City, 110",
        activityStartDate: "1997-01-01",
        activityEndDate: "1997-01-01",
      },
      ticketArea: "A",
      ticketType: "Early bird",
      ticketSeat: "H5B22",
      ticketPrice: "NT$123",
      ticketQrCode: "ticketQrCode",
    },
  });
});

export const createOne = catchAsync((req, res, next) => {
  res.status(201).json({
    status: "success",
    code: "200",
    message: "Get tickets successfully",
    data: {
      ticketId: "643adabe75cf2e2f24a07b03",
      isRefunded: true,
      ticketSellDate: "1997-01-01",
      ticketReturnDate: "1997-01-01",
      orderId: "643adabe75cf2e2f24a07b03",
      activity: {
        activityID: "643adabe75cf2e2f24a07b03",
        isEnd: false,
        loc: "No. 45 , City Hall Rd, Xinyi District, Taipei City, 110",
        activityStartDate: "1997-01-01",
        activityEndDate: "1997-01-01",
      },
      ticketArea: "A",
      ticketType: "Early bird",
      ticketSeat: "H5B22",
      ticketPrice: "NT$123",
      ticketQrCode: "ticketQrCode",
    },
  });
});

export const updateOne = catchAsync((req, res, next) => {
  res.status(200).json({
    status: "success",
    code: "200",
    message: "Get tickets successfully",
    data: {
      ticketId: "643adabe75cf2e2f24a07b03",
      isRefunded: true,
      ticketSellDate: "1997-01-01",
      ticketReturnDate: "1997-01-01",
      orderId: "643adabe75cf2e2f24a07b03",
      activity: {
        activityID: "643adabe75cf2e2f24a07b03",
        isEnd: false,
        loc: "No. 45 , City Hall Rd, Xinyi District, Taipei City, 110",
        activityStartDate: "1997-01-01",
        activityEndDate: "1997-01-01",
      },
      ticketArea: "A",
      ticketType: "Early bird",
      ticketSeat: "H5B22",
      ticketPrice: "NT$123",
      ticketQrCode: "ticketQrCode",
    },
  });
});

export const deleteOne = catchAsync((req, res, next) => {
  res.status(204).json();
});
