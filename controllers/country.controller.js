const logger = require("../common/logger");
const RESPONSE = require("../common/response");
const DB_MODEL = require("../models/index.model");

/**
 * Retrieves all country data (Country, ISO3 Code) based on the provided query parameters.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {Promise<void>} The response with the country list.
 */
exports.getCountryList = async (req, res) => {
  const attribute_list = ["area", "iso3_code", "latitude", "longitude"];
  try {
    // get country list
    const countryList = await DB_MODEL.COUNTRY.findAll({
      attributes: attribute_list,
      order: [["area", "ASC"]],
    });
    RESPONSE.Success(res, countryList);
  } catch (error) {
    logger.error(`Error retrieving country list: ${error}`);
    RESPONSE.ServerError(res, { message: error.message });
  }
};
