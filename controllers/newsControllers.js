import catchAsync from "../utils/error/catchAsync.js";

export const getAll = catchAsync((req, res, next) => {
  res.status(200).json({
    status: "success",
    code: "200",
    message: "Get news successfully",
    data: [
      {
        messageId: "643adabe75cf2e2f24a07b03",
        activityId: "643adabe75cf2e2f24a07b03",
        isSystem: false,
        messageContent: "some message",
      },
    ],
  });
});

export const getOne = catchAsync((req, res, next) => {
  res.status(200).json({
    status: "success",
    code: "200",
    message: "Get news successfully",
    data: [
      {
        messageId: "643adabe75cf2e2f24a07b03",
        activityId: "643adabe75cf2e2f24a07b03",
        isSystem: false,
        messageContent: "some message",
      },
    ],
  });
});

export const createOne = catchAsync((req, res, next) => {
  res.status(201).json({
    status: "success",
    code: "200",
    message: "Create news successfully",
    data: [
      {
        messageId: "643adabe75cf2e2f24a07b03",
        activityId: "643adabe75cf2e2f24a07b03",
        isSystem: false,
        messageStartDate: "1997-01-01",
        messageEndDate: "1997-01-01",
        messageContent: "some message",
      },
    ],
  });
});

export const updateOne = catchAsync((req, res, next) => {
  res.status(200).json({
    status: "success",
    code: "200",
    message: "Create news successfully",
    data: [
      {
        messageId: "643adabe75cf2e2f24a07b03",
        activityId: "643adabe75cf2e2f24a07b03",
        isSystem: false,
        messageStartDate: "2023-01-01",
        messageEndDate: "1997-01-01",
        messageContent: "another message",
      },
    ],
  });
});

export const deleteOne = catchAsync((req, res, next) => {
  res.status(204).json();
});
