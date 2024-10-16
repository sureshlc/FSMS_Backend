const RESPONSE = require("../common/response");
const CONST_UTILS = require("../utils/constantUtils");
const { getCategoryAndIndicatorDetails } = require("../utils/categoryUtils");
const DB_MODEL = require("../models/index.model");
const { getIndicatorHandler } = require("../handler/indicator.handler");
const logger = require("../common/logger");

/**
 * Retrieves indicator data based on the request body, and sends the response.
 *
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @return {Indicator Data} - a promise that resolves when the data is retrieved and response is sent
 */
exports.getIndicatorData = async (req, res) => {
  const query = req.body;
  try {
    const tableModel = CONST_UTILS.TABLE_MODEL(query.category);
    const { categoryDetails, indicatorDetails } =
      await getCategoryAndIndicatorDetails(
        query.category,
        query.indicator,
        query.commodity
      );

    if (!categoryDetails.isAvailable()) {
      RESPONSE.Success(res, {});
      return;
    }

    const responses = await getIndicatorHandler.getIndicatorResponse(
      tableModel,
      indicatorDetails,
      query,
      categoryDetails
    );

    const response = responses.length === 1 ? responses[0] : responses;
    RESPONSE.Success(res, response);
  } catch (error) {
    console.error(error);
    logger.error(
      `Error retrieving indicator data: ${
        error.message
      }, for query: ${JSON.stringify(query)}`
    );
    RESPONSE.ServerError(res, { message: error.message });
  }
};

/**
 * Retrieves a list of indicators based on the provided category ID.
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @return {List} A promise that resolves with the list of indicators or rejects with a server error
 */
exports.getIndicatorList = async (req, res) => {
  const query = req.query;
  try {
    const indicatorList = await DB_MODEL.INDICATOR_DETAILS.findAll({
      attributes: ["indicator_name"],
      where: {
        category_id: query.category.toUpperCase(),
      },
      order: [["indicator_name", "ASC"]],
    });

    const reponse = indicatorList.map((indicator) => indicator.indicator_name);

    RESPONSE.Success(res, { indicatorList: reponse });
  } catch (error) {
    console.error(error);
    logger.error(`Error retrieving indicator list: ${error.message}`);
    RESPONSE.ServerError(res, { message: error.message });
  }
};
