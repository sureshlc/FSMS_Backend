const Joi = require("joi");
const REQ_SCHEMA = require("../../models/index.schema");

// returns a function that tests the input against the schema
const testSchema = (input, schema) => () => Joi.assert(input, schema);

describe("getAlerts Schema", () => {
  // constants
  const schema = REQ_SCHEMA.ALERTS.getAlerts;
  const validInputList = [
    {
      category: "production_trade",
      year: "2022",
      area: "area",
      threshold: true,
      sort: 1,
    },
    {
      category: "food_security",
      year: "2012",
      threshold: false,
      trend: true,
    },
  ];

  const invalidInputList = [
    {
      category: "InvalidCategory",
      year: "InvalidYear",
      area: "InvalidArea",
      threshold: "InvalidThreshold",
      sort: "InvalidSort",
    },
    {
      category: null,
      year: "2023",
      area: "ValidArea",
      threshold: true,
      sort: 1,
      trend: "yes",
    },
    {
      year: "2023",
      sort: 2,
    },
  ];

  it("valid request", () => {
    // Act & Assert
    for (const input of validInputList) {
      expect(testSchema(input, schema)).not.toThrow();
    }
  });

  it("invalid request", () => {
    // Act & Assert
    for (const input of invalidInputList) {
      expect(testSchema(input, schema)).toThrow();
    }
  });
});

describe("getCategoryTrend Schema", () => {
  // constants
  const schema = REQ_SCHEMA.ALERTS.getCategoryTrend;
  const validInputList = [
    {
      category: "production_trade",
      area: "area",
      fromYear: "2022",
      sort: 1,
      forecast: 0,
    },
    {
      category: "food_security",
      area: null,
      fromYear: "2000",
      sort: -1,
    },
  ];

  const invalidInputList = [
    {
      category: "invalidCategory",
      area: "area",
      noOfYears: 10,
      fromYear: "2022",
      sort: 1,
    },
    {
      area: "area",
      noOfYears: 10,
      fromYear: "2022",
      sort: 1,
    },
    {
      area: "area",
      noOfYears: 22,
      fromYear: "2022",
      sort: 1,
    },
    {
      noOfYears: 22,
      fromYear: 2022,
      sort: 5,
    },
  ];

  it("valid request", () => {
    // Act & Assert
    for (const input of validInputList) {
      expect(testSchema(input, schema)).not.toThrow();
    }
  });

  it("invalid request", () => {
    // Act & Assert
    for (const input of invalidInputList) {
      expect(testSchema(input, schema)).toThrow();
    }
  });
});

describe("getAlertNotifications Schema", () => {
  // constants
  const schema = REQ_SCHEMA.ALERTS.getAlertNotifications;
  const validInputList = [
    {
      category: "production_trade",
    },
    {
      category: "food_security",
    },
  ];

  const invalidInputList = [
    {
      category: "invalidCategory",
    },
  ];

  it("valid request", () => {
    // Act & Assert
    for (const input of validInputList) {
      expect(testSchema(input, schema)).not.toThrow();
    }
  });

  it("invalid request", () => {
    // Act & Assert
    for (const input of invalidInputList) {
      expect(testSchema(input, schema)).toThrow();
    }
  });
});
