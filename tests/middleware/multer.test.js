// Mock modules
jest.mock("../../common/response", () => {
  return {
    ServerError: jest.fn(),
  };
});

// import mocks
const multer = require("multer");
const uploadHandler = require("../../middleware/multer");
const RESPONSE = require("../../common/response");

describe("Upload Handler Middleware", () => {
  let mockReq;
  let mockRes;
  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Mock Implemenation
  const multerInstance = jest.fn();

  it("should handle file upload successfully", () => {
    // Arrange
    const middleware = uploadHandler(multerInstance);
    multerInstance.mockImplementation((req, res, callback) => {
      callback();
    });

    // Act
    middleware(mockReq, mockRes, next);

    // Assert
    expect(RESPONSE.ServerError).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it("should handle Multer error", () => {
    // Arrange
    const middleware = uploadHandler(multerInstance);

    const multerError = new multer.MulterError("Multer error message");
    multerInstance.mockImplementation((req, res, callback) => {
      callback(multerError);
    });

    // Act
    middleware(mockReq, mockRes, next);

    // Assert
    expect(RESPONSE.ServerError).toHaveBeenCalledWith(mockRes, multerError);
    expect(next).not.toHaveBeenCalled();
  });

  it("should handle other errors", () => {
    // Arrange
    const middleware = uploadHandler(multerInstance);

    const errorMessage = "Some other error message";
    multerInstance.mockImplementation((req, res, callback) => {
      callback(new Error(errorMessage));
    });

    // Act
    middleware(mockReq, mockRes, next);

    // Assert
    expect(RESPONSE.ServerError).toHaveBeenCalledWith(mockRes, {
      message: errorMessage,
    });
    expect(next).not.toHaveBeenCalled();
  });
});
