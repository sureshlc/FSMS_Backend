const DB_MODEL = require("../models/index.model");
const RESPONSE = require("../common/response");
const logger = require("../common/logger");

/**
 * Get the timestamp of the last update.
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 */
exports.getLastUpdated = async (req, res) => {
  try {
    // Retrieve the latest update from the database
    const latestUpdate = await DB_MODEL.LAST_UPDATED.findOne({
      order: [["timestamp", "DESC"]],
    });

    let lastUpdatedTime = {
      date: "",
      time: "",
    };

    if (latestUpdate) {
      // Format the timestamp for display
      const options = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        timeZone: "UTC",
      };

      const formattedDate = latestUpdate.timestamp.toLocaleString(
        "en-US",
        options
      );

      // Extract date and time components
      lastUpdatedTime.date = formattedDate.slice(0, 12);
      lastUpdatedTime.time = [formattedDate.slice(14), options.timeZone].join(
        " "
      );
    }
    RESPONSE.Success(res, lastUpdatedTime);
  } catch (error) {
    logger.error(`Error retrieving last updated: ${error.message}`);
    RESPONSE.ServerError(res, { message: error.message });
  }
};

/**
 * Sets the last updated timestamp in the database.
 *
 * @return {Promise<void>} A promise that resolves when the operation is complete
 */
exports.setLastUpdated = async () => {
  try {
    await DB_MODEL.LAST_UPDATED.create({
      timestamp: new Date(),
    });
  } catch (error) {
    logger.error(`Error setting last updated: ${error.message}`);
  }
};
