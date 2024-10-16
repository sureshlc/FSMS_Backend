const Joi = require("joi");
const {
  validateRequestQuery,
  validateRequestBody,
  validateRequestParams,
} = require("../../middleware/validator");

describe("validateRequestQuery should validate request query", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      query: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should call next if request query is valid", () => {
    const schema = Joi.object({
      username: Joi.string().required(),
      age: Joi.number().integer().min(18),
    });
    req.query = {
      username: "test-user",
      age: 25,
    };

    validateRequestQuery(schema)(req, res, next);

    expect(next).toBeCalledTimes(1);
    expect(res.status).not.toBeCalled();
    expect(res.json).not.toBeCalled();
  });

  test("should return 400 status and error message if request query is invalid", () => {
    const schema = Joi.object({
      username: Joi.string().required(),
      age: Joi.number().integer().min(18),
    });
    req.query = {
      username: "test-user",
      age: "invalid",
    };

    validateRequestQuery(schema)(req, res, next);

    expect(next).not.toBeCalled();
    expect(res.status).toBeCalledWith(400);
    expect(res.json).toBeCalledWith({
      error: {
        message: "Invalid request query",
        details: '"age" must be a number',
      },
      status: 400,
    });
  });
});

describe("validateRequestBody should validate request body", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should call the next middleware if the request body is valid", () => {
    const schema = Joi.object({
      name: Joi.string().required(),
      colors: Joi.array().items(Joi.string()).optional(),
    });

    req.body = {
      name: "test-name",
      colors: ["blue", "red"],
    };

    validateRequestBody(schema)(req, res, next);

    expect(next).toBeCalledTimes(1);
    expect(res.status).not.toBeCalled();
    expect(res.json).not.toBeCalled();
  });

  it("should return a 400 status and error response if the request body is invalid", () => {
    const schema = Joi.object({
      name: Joi.string().required(),
      colors: Joi.array().items(Joi.string()).optional(),
    });

    req.body = {
      name: "test-name",
      colors: "blue", // invalid
    };

    validateRequestBody(schema)(req, res, next);

    expect(next).not.toBeCalled();
    expect(res.status).toBeCalledWith(400);
    expect(res.json).toBeCalledWith({
      error: {
        message: "Invalid request body",
        details: '"colors" must be an array',
      },
      status: 400,
    });
  });
});

describe("validateRequestParams should validate request params", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      params: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should call next if request params is valid", () => {
    const schema = Joi.object({
      number: Joi.number().required(),
      prime: Joi.boolean().required(),
    });

    req.params = {
      number: 5,
      prime: true,
    };

    validateRequestParams(schema)(req, res, next);

    expect(next).toBeCalledTimes(1);
    expect(res.status).not.toBeCalled();
    expect(res.json).not.toBeCalled();
  });
  test("should return 400 status and error message if request params is invalid", () => {
    const schema = Joi.object({
      number: Joi.number().required(),
      prime: Joi.boolean().required().optional(),
    });

    req.params = {
      number: 7,
      prime: "isValid", // invalid
    };

    validateRequestParams(schema)(req, res, next);

    expect(next).not.toBeCalled();
    expect(res.status).toBeCalledWith(400);
    expect(res.json).toBeCalledWith({
      error: {
        message: "Invalid request params",
        details: '"prime" must be a boolean',
      },
      status: 400,
    });
  });
});
