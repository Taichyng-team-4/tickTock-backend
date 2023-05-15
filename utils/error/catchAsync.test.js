import catchAsync from "./catchAsync";

describe("catchAsync", () => {
  let req, res, next, func;
  beforeAll(() => {
    req = {};
    res = vi.fn();
    next = vi.fn();
    func = vi.fn();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should call the input function by req, res and next", async () => {
    func.mockImplementationOnce(async () => {});

    let error;
    const catchAsyncFunc = catchAsync(func);
    await catchAsyncFunc(req, res, next).catch((err) => (error = err));

    expect(func).toHaveBeenCalledWith(req, res, next);
  });

  test("should catch the error if input function has an error", async () => {
    func.mockImplementationOnce(async () => {
      throw new Error();
    });

    let error;
    const catchAsyncFunc = catchAsync(func);
    await catchAsyncFunc(req, res, next).catch((err) => (error = err));

    expect(error).toBeUndefined();
  });

  test("should pass an error to next function if input function has an error", async () => {
    const targetError = new Error();
    func.mockImplementationOnce(async () => {
      throw targetError;
    });

    let error;
    const catchAsyncFunc = catchAsync(func);
    await catchAsyncFunc(req, res, next).catch((err) => (error = err));

    expect(next).toHaveBeenCalledWith(targetError);
  });

  test("should not pass error to next if func resolve", async () => {
    func.mockImplementationOnce(async () => {});

    let error;
    const catchAsyncFunc = catchAsync(func);
    await catchAsyncFunc(req, res, next).catch((err) => (error = err));

    expect(next).not.toHaveBeenCalled();
  });
});
