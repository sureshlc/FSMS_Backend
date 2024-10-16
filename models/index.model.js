const Alerts = require("./db/alerts.model");
const Country = require("./db/country.model");
const FoodSecurity = require("./db/food_security.model");
const Manifest = require("./db/manifest.model");
const Threshold = require("./db/threshold.model");
const CategoryDetails = require("./db/category_details.model");
const IndicatorDetails = require("./db/indicator_details.model");
const ProductionTrade = require("./db/production_trade.model");
const LastUpdated = require("./db/last_updated.model");
const logger = require("../common/logger");
const FoodPrice = require("./db/food_price.model");
const Investment = require("./db/investment.model");
const Consumption = require("./db/consumption.model");
const CategoryTrends = require("./db/category_trends.model");
const AlertNotifications = require("./db/notifications.model");
const Sustainability = require("./db/sustainability.model");
const User = require("./db/user.model");

// consolidated list of models
const DB_MODEL = {
  USER: User,
  ALERTS: Alerts,
  ALERT_NOTIFICATIONS: AlertNotifications,
  COUNTRY: Country,
  MANIFEST: Manifest,
  THRESHOLD: Threshold,
  CATEGORY_DETAILS: CategoryDetails,
  CATEGORY_TRENDS: CategoryTrends,
  INDICATOR_DETAILS: IndicatorDetails,
  LAST_UPDATED: LastUpdated,
  FOOD_SECURITY: FoodSecurity,
  PRODUCTION_TRADE: ProductionTrade,
  CONSUMPTION: Consumption,
  FOOD_PRICE: FoodPrice,
  INVESTMENT: Investment,
  SUSTAINABILITY: Sustainability,
};

/**
 * Synchronizes all models
 */
const syncPromises = Object.values(DB_MODEL).map((model) => model.sync());

/**
 * Associates models by defining their relationships.
 */
const associateModels = () => {
  // associate models
  DB_MODEL.ALERTS.belongsTo(DB_MODEL.COUNTRY, {
    foreignKey: "area",
    targetKey: "area",
  });

  DB_MODEL.INDICATOR_DETAILS.belongsTo(DB_MODEL.CATEGORY_DETAILS, {
    foreignKey: "category_id",
    targetKey: "category_id",
  });
};

Promise.all(syncPromises)
  .then(() => {
    logger.info("All DB models synced successfully");
    associateModels();
    logger.info("All DB models associated successfully");
  })
  .catch((error) => {
    logger.error("Error syncing models:", error);
  });

module.exports = DB_MODEL;
