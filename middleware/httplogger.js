const morgan = require("morgan");
const logger = require("../common/logger");

/**
 * Middleware that logs HTTP requests.
 */
logger.stream = {
  write: (message) =>
    logger.info(message.substring(0, message.lastIndexOf("\n"))),
};

module.exports = morgan(
  ":method :url :status :response-time ms - :res[content-length]",
  { stream: logger.stream }
);
