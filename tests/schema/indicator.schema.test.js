const Joi = require("joi");
const REQ_SCHEMA = require("../../models/index.schema");

// returns a function that tests the input against the schema
const testSchema = (input, schema) => () => Joi.assert(input, schema);

describe("getIndicatorData Schema", () => {
  // constants
  const schema = REQ_SCHEMA.INDICATOR.getIndicatorData;
  const validInputList = [
    {
      category: "production_trade",
      indicator: "sample indicator - yield",
      commodity: "sample commodity",
      area: "area",
      fromYear: "2018",
      forecast: 2,
      sort: 1,
    },
    {
      category: "food_security",
      indicator: "prevalance of undernourishment",
      area: "area",
      fromYear: "2018",
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
