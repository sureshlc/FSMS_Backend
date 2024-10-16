const logger = require("../common/logger");
const RESPONSE = require("../common/response");
const { getCategoryAndIndicatorDetails } = require("../utils/categoryUtils");
const CONST_UTILS = require("../utils/constantUtils");
const {
  getAlertsHandler,
  getCategoryTrendHandler,
  getNotificationsHandler,
} = require("../handler/alerts.handler");
const { getIndicatorHandler } = require("../handler/indicator.handler");

/**
 * Retrieves and processes alerts based on the provided query parameters.
 *
 * @param {Object} req - The request object containing the query parameters.
 * @param {Object} res - The response object for sending the processed alerts.
 * @return {Alerts} A promise that resolves with the processed alerts.
 */
exports.getAlerts = async (req, res) => {
  const query = req.body;
  try {
    const whereClause = await getAlertsHandler.buildWhereClause(query);
    const alerts = await getAlertsHandler.fetchAlerts(whereClause, query.sort);
    const processedAlerts = await Promise.all(
      alerts.map((alert) => getAlertsHandler.processAlerts(alert, query.trend))
    );
    const groupedByCategory = getAlertsHandler.groupAlerts(processedAlerts);
    const formattedAlerts = await getAlertsHandler.formatAlerts(
      groupedByCategory
    );
    RESPONSE.Success(res, formattedAlerts);
  } catch (error) {
    logger.error("Error retrieving alerts:", error);
    RESPONSE.ServerError(res, { message: error.message });
  }
};

/**
 * Retrieves the category trend (which is the indicator data for the trend) and formats the response.
 *
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @return {Indicactor Data} - a promise that resolves with the formatted response
 */
exports.getCategoryTrend = async (req, res) => {
  const query = req.body;
  try {
    const tableModel = CONST_UTILS.TABLE_MODEL(query.category);
    const { categoryDetails, indicatorDetails } =
      await getCategoryAndIndicatorDetails(query.category);

    // handling no data
    if (!categoryDetails?.isAvailable || !indicatorDetails) {
      RESPONSE.Success(res, []);
      return;
    }

    const alerts = await getCategoryTrendHandler.getTrendAlerts(query);
    const responses = await getIndicatorHandler.getIndicatorResponse(
      tableModel,
      indicatorDetails,
      query,
      categoryDetails
    );

    const responseData = getCategoryTrendHandler.formatResponse(
      responses,
      alerts,
      categoryDetails?.trendIndicator
    );
    RESPONSE.Success(res, responseData);
  } catch (error) {
    logger.error("Error retrieving category trend:", error);
    console.error(error);
    RESPONSE.ServerError(res, { message: error.message });
  }
};

/**
 * Retrieves alert notifications based on the provided request and sends the response.
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @return {Alert notifications} A promise that resolves when the alert notifications are retrieved and the response is sent
 */
exports.getAlertNotifications = async (req, res) => {
  const query = req.query;
  try {
    const whereClause = getNotificationsHandler.buildWhereClause(query);
    const notifications = await getNotificationsHandler.getNotifications(
      whereClause
    );
    const response = await getNotificationsHandler.formatWithIso3Code(
      notifications
    );
    RESPONSE.Success(res, response);
  } catch (error) {
    logger.error("Error retrieving alerts:", error);
    RESPONSE.ServerError(res, { message: error.message });
  }
};
