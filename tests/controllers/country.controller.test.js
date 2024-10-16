// Mock Modules
jest.mock("../../models/index.model", () => {
  return {
    COUNTRY: {
      findAll: jest.fn(),
    },
  };
});

jest.mock("../../common/response", () => {
  return {
    ServerError: jest.fn(),
    Success: jest.fn(),
  };
});
// Imports Modules
const RESPONSE = require("../../common/response");
const { getCountryList } = require("../../controllers/country.controller");
const DB_MODEL = require("../../models/index.model");

describe("getCountryList", () => {
  let mockReq;
  let mockRes;
  beforeEach(() => {
    mockReq = {
      query: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // constants
  const countryList = [
    {
      area: "area1",
      iso3_code: "iso3_code1",
      latitude: 100,
      longitude: 100,
    },
    {
      area: "area2",
      iso3_code: "iso3_code2",
      latitude: 100,
      longitude: 321,
    },
  ];

  // mock implementations

  it("should return the country list with status 200 on success", async () => {
    // Arrange
    mockReq.query = {
      latitude: 100,
    };

    // Mock implementation
    DB_MODEL.COUNTRY.findAll.mockResolvedValue(countryList);

    // Act
    await getCountryList(mockReq, mockRes);

    // Assert
    expect(DB_MODEL.COUNTRY.findAll).toHaveBeenCalledWith({
      attributes: ["area", "iso3_code", "latitude", "longitude"],
      where: mockReq.query,
    });
    expect(RESPONSE.Success).toHaveBeenCalledWith(mockRes, countryList);
  });

  it("should return status 500 if an error occurs", async () => {
    // Arrange
    mockReq.query = {
      latitude: 100,
    };
    const error = new Error("test error");

    // Mock implementation
    DB_MODEL.COUNTRY.findAll.mockRejectedValue(error);

    // Act
    await getCountryList(mockReq, mockRes);

    // Assert
    expect(DB_MODEL.COUNTRY.findAll).toHaveBeenCalled();
    expect(RESPONSE.ServerError).toHaveBeenCalledWith(mockRes, {
      message: error.message,
    });
  });
});
