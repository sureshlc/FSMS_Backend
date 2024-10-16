const winston = require("winston");
const { createLogger, transports } = winston;
const { combine, timestamp, printf } = winston.format;
const {
  LOGS_MAX_RETAIN_TIME,
  LOGS_MAX_SIZE,
  LOGS_SUBFOLDER,
} = require("../constants/logs.constants");
const DailyRotateFile = require("winston-daily-rotate-file");

const LOG_FILE_LOCATION = process.env.LOG_FILE_LOCATION || "";

const customFormat = printf(({ level, message, timestamp }) => {
  return JSON.stringify({
    timestamp,
    level,
    message,
  });
});

/**
 * Winston Logger
 */
const logger = createLogger({
  level: "info",
  format: combine(
    timestamp({
      format: "YYYY-MM-DD hh:mm:ss:ms A",
    }),
    customFormat
  ),
  transports: [
    new transports.Console(),
    new DailyRotateFile({
      filename: `${LOG_FILE_LOCATION + LOGS_SUBFOLDER.APP}/app-%DATE%.log`,
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: LOGS_MAX_SIZE,
      maxFiles: LOGS_MAX_RETAIN_TIME,
    }),
    new DailyRotateFile({
      filename: `${LOG_FILE_LOCATION + LOGS_SUBFOLDER.ERROR}/error-%DATE%.log`,
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: LOGS_MAX_SIZE,
      maxFiles: LOGS_MAX_RETAIN_TIME,
      level: "error",
    }),
  ],
});

// Disable logging during tests
if (process.env.NODE_ENV === "test") {
  logger.transports.forEach((transport) => (transport.silent = true));
}

module.exports = logger;
