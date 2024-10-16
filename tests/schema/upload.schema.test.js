const Joi = require("joi");
const REQ_SCHEMA = require("../../models/index.schema");

// returns a function that tests the input against the schema
const testSchema = (input, schema) => () => Joi.assert(input, schema);

describe("uploadSchema", () => {
  // constants
  const schema = REQ_SCHEMA.UPLOAD.uploadSchema;
  const validInputList = [
    {
      tableName: "sample-table",
    },
    {
      tableName: null,
    },
  ];

  const invalidInputList = [
    {
      tableName: 123,
    },
    {
      table: "table",
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
