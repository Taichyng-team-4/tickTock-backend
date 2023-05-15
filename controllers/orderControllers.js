import catchAsync from "../utils/error/catchAsync.js";

export const getAll = catchAsync((req, res, next) => {
  res.status(200).json({
    status: "success",
    code: "200",
    message: "Get news successfully",
    data: [
      {
        orderId: "643adabe75cf2e2f24a07b03",
        isRefunded: true,
        activity: {
          isEnd: true,
          activityID: "643adabe75cf2e2f24a07b03",
          loc: "No. 45 , City Hall Rd, Xinyi District, Taipei City, 110",
          activityStartDate: "1997-01-01",
          activityEndDate: "1997-01-01",
        },
        tickets: [
          {
            ticketId: "643adabe75cf2e2f24a07b03",
            ticketType: "Early bird",
            ticketArea: "A",
            ticketSeat: "H5B22",
            ticketPrice: "NT$123",
            ticketQrCode: "ticketQrCode",
          },
        ],
      },
    ],
  });
});

export const getOne = catchAsync((req, res, next) => {
  res.status(200).json({
    status: "success",
    code: "200",
    message: "Get orders successfully",
    data: {
      orderId: "643adabe75cf2e2f24a07b03",
      isRefunded: true,
      activity: {
        isEnd: true,
        activityID: "643adabe75cf2e2f24a07b03",
        loc: "No. 45 , City Hall Rd, Xinyi District, Taipei City, 110",
        activityStartDate: "1997-01-01",
        activityEndDate: "1997-01-01",
      },
      tickets: [
        {
          ticketId: "643adabe75cf2e2f24a07b03",
          ticketType: "Early bird",
          ticketArea: "A",
          ticketSeat: "H5B22",
          ticketPrice: "NT$123",
          ticketQrCode: "ticketQrCode",
        },
      ],
    },
  });
});

export const createOne = catchAsync((req, res, next) => {
  res.status(201).json({
    status: "success",
    code: "200",
    message: "Lead to cash flow",
    data: {
      orderId: "643adabe75cf2e2f24a07b03",
      isRefunded: true,
      activity: {
        isEnd: true,
        activityID: "643adabe75cf2e2f24a07b03",
        loc: "No. 45 , City Hall Rd, Xinyi District, Taipei City, 110",
        activityStartDate: "1997-01-01",
        activityEndDate: "1997-01-01",
      },
      tickets: [
        {
          ticketId: "643adabe75cf2e2f24a07b03",
          ticketType: {
            ticketTypeId: "643adabe75cf2e2f24a07b03",
            ticketType: "Early bird",
            ticketArea: "A",
          },
          ticketSeat: "H5B22",
          ticketPrice: "NT$123",
          ticketQrCode: "ticketQrCode",
        },
      ],
    },
  });
});

export const updateOne = catchAsync((req, res, next) => {
  res.status(200).json({
    status: "success",
    code: "200",
    message: "Get orders successfully",
    data: {
      orderId: "643adabe75cf2e2f24a07b03",
      isRefunded: true,
      activity: {
        isEnd: true,
        activityID: "643adabe75cf2e2f24a07b03",
        loc: "No. 45 , City Hall Rd, Xinyi District, Taipei City, 110",
        activityStartDate: "1997-01-01",
        activityEndDate: "1997-01-01",
      },
      tickets: [
        {
          ticketId: "643adabe75cf2e2f24a07b03",
          ticketType: "Early bird",
          ticketArea: "A",
          ticketSeat: "H5B22",
          ticketPrice: "NT$159",
          ticketQrCode: "ticketQrCode",
        },
      ],
    },
  });
});

export const deleteOne = catchAsync((req, res, next) => {
  res.status(204).json();
});

export const getBuyersInfo = catchAsync((req, res, next) => {
  res.status(200).json({
    status: "success",
    code: "200",
    message: "Get buyer information successfully",
    data: [
      {
        orderId: "643adabe75cf2e2f24a07b03",
        isRefunded: true,
        buyers: [
          {
            userId: "643adabe75cf2e2f24a07b03",
            name: "Tom",
            email: "A",
            type: "cards",
            quantity: 1,
            price: "NT$159",
            amount: "NT$159",
          },
        ],
      },
    ],
  });
});
