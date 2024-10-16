const logger = require("../common/logger");
const RESPONSE = require("../common/response");

/**
 * Validates a request based on the provided schema and source.
 */
const validateRequest =
  (schema, source, validationMessage) => (req, res, next) => {
    const { error } = schema.validate(source(req));

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(", ");
      logger.error(`Validation Error: ${errorMessage}`);
      RESPONSE.BadRequest(res, {
        message: validationMessage,
        details: errorMessage,
      });
    } else {
      next();
    }
  };

/**
 * Middleware to validate the request query against the provided schema.
 *
 * @param {Object} schema - The Joi schema used for validation.
 * @returns {Function} - The middleware function that handles the validation.
 */
const validateRequestQuery = (schema, message = "Invalid request query") =>
  validateRequest(schema, (req) => req.query, message);

/**
 * Middleware to validate the request body against the provided schema.
 *
 * @param {Object} schema - The Joi schema used for validation.
 * @returns {Function} - The middleware function that handles the validation.
 */
const validateRequestBody = (schema, message = "Invalid request body") =>
  validateRequest(schema, (req) => req.body, message);

/**
 * Middleware to validate the request parameters against the provided schema.
 *
 * @param {Object} schema - The Joi schema used for validation.
 * @returns {Function} - The middleware function that handles the validation.
 */
const validateRequestParams = (schema, message = "Invalid request params") =>
  validateRequest(schema, (req) => req.params, message);

module.exports = {
  validateRequestQuery,
  validateRequestBody,
  validateRequestParams,
};
