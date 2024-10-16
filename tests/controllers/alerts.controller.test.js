// Mock Modules
jest.mock("../../handler/alerts.handler", () => {
  return {
    getAlertsHandler: {
      buildWhereClause: jest.fn(),
      fetchAlerts: jest.fn(),
      processAlerts: jest.fn(),
      groupAlerts: jest.fn(),
      formatAlerts: jest.fn(),
    },
    getCategoryTrendHandler: jest.fn(),
    getNotificationsHandler: jest.fn(),
  };
});
jest.mock("../../common/response", () => {
  return {
    Success: jest.fn(),
    ServerError: jest.fn(),
  };
});

// Imports Modules
const { getAlerts } = require("../../controllers/alerts.controller");
const RESPONSE = require("../../common/response");
const { getAlertsHandler } = require("../../handler/alerts.handler");

describe(" ", () => {
  let mockReq;
  let mockRes;
  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // constants
  const whereClause = {
    category: "category",
    area: "area",
  };
  const alerts = [
    {
      id: 1,
      category: "production_trade",
      message: "Alert 1",
    },
    {
      id: 2,
      category: "food_security",
      message: "Alert 2",
    },
  ];
  const processedAlerts = [
    {
      id: 1,
      category: "production_trade",
      message: "Processed Alert 1",
    },
    {
      id: 2,
      category: "food_security",
      message: "Processed Alert 2",
    },
  ];

  const groupedByCategory = {
    production_trade: [
      {
        id: 1,
        message: "Processed Alert 1",
      },
    ],
    food_security: [
      {
        id: 2,
        message: "Processed Alert 2",
      },
    ],
  };

  const formattedAlerts = [
    {
      category: "production_trade",
      alerts: [
        {
          id: 1,
          message: "Processed Alert 1",
        },
      ],
    },
    {
      category: "food_security",
      alerts: [
        {
          id: 2,
          message: "Processed Alert 2",
        },
      ],
    },
  ];

  // mock implementations

  it("should retrieve and process alerts successfully", async () => {
    mockReq.body = {
      category: "category",
      area: "area",
      sort: 1,
    };

    getAlertsHandler.buildWhereClause.mockResolvedValue(whereClause);
    getAlertsHandler.fetchAlerts.mockResolvedValue(alerts);
    getAlertsHandler.processAlerts.mockResolvedValue(processedAlerts);
    getAlertsHandler.groupAlerts.mockReturnValue(groupedByCategory);
    getAlertsHandler.formatAlerts.mockResolvedValue(formattedAlerts);

    await getAlerts(mockReq, mockRes);

    expect(getAlertsHandler.buildWhereClause).toHaveBeenCalledWith(
      mockReq.body
    );
    expect(getAlertsHandler.fetchAlerts).toHaveBeenCalledWith(
      whereClause,
      mockReq.body.sort
    );
    expect(getAlertsHandler.processAlerts).toHaveBeenCalledTimes(alerts.length);
    expect(getAlertsHandler.groupAlerts).toHaveBeenCalledWith(processedAlerts);
    expect(getAlertsHandler.formatAlerts).toHaveBeenCalledWith(
      groupedByCategory
    );
    expect(RESPONSE.Success).toHaveBeenCalledWith(mockRes, formattedAlerts);
  });

  it("should handle errors", async () => {
    const errorMessage = "Internal Server Error";
    const error = new Error(errorMessage);

    getAlertsHandler.buildWhereClause.mockRejectedValue(error);

    await getAlerts(req, res);

    expect(logger.error).toHaveBeenCalledWith(
      "Error retrieving alerts:",
      error
    );
    expect(RESPONSE.ServerError).toHaveBeenCalledWith(res, {
      message: errorMessage,
    });
  });
});
