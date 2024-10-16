const csv = require("csvtojson");
const logger = require("../common/logger");

/**
 * Parses a file using the csv() function from the csv-parser library.
 *
 * @param {string} filepath - The path to the file to be parsed.
 * @param {function} keyTransformFn - (Optional) A function to transform the header keys. Defaults to toLowerCase.
 * @return {Promise} A Promise that resolves to the parsed data from the file.
 */
exports.csvParseFile = async (filepath) => {
  try {
    return await csv().fromFile(filepath);
  } catch (error) {
    logger.error("Error parsing CSV file:", error);
    throw error;
  }
};

/**
 * Parses a stream using the csv module and returns the parsed data.
 *
 * @param {Stream} stream - The stream to be parsed.
 * @param {Function} keyTransformFn - (optional) A function to transform the header keys.
 * @return {Promise} A promise that resolves with the parsed data.
 */
exports.csvParseStream = async (stream) => {
  try {
    return await csv().fromStream(stream);
  } catch (error) {
    logger.error("Error parsing CSV file:", error);
    throw error;
  }
};
