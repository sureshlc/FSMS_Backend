const { uploadSchema } = require("./schema/upload.schema");
const {
  getAlerts,
  getCategoryTrend,
  getAlertNotifications,
} = require("./schema/alerts.schema");
const { getIndicatorData } = require("./schema/indicator.schema");
const { calcForGivenCategory } = require("./schema/calc.schema");
const { signUpUser, loginUser } = require("./schema/auth.schema");

// consolidated list of request schemas
const REQ_SCHEMA = {
  AUTH: {
    signUpUser,
    loginUser,
  },
  UPLOAD: {
    uploadSchema,
  },
  ALERTS: {
    getAlerts,
    getAlertNotifications,
    getCategoryTrend,
  },
  INDICATOR: {
    getIndicatorData,
  },
  CALC: {
    calcForGivenCategory,
  },
};

module.exports = REQ_SCHEMA;
