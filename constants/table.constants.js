// all tables names are in lower case
const TABLE_NAMES = {
  ALERTS: "alerts",
  ALERT_NOTIFICATIONS: "alert_notifications",
  FOOD_SECURITY: "food_security",
  PRODUCTION_TRADE: "production_trade",
  COUNTRY: "country",
  MANIFEST: "manifest",
  LAST_UPDATED: "last_updated",
  CATEGORY_DETAILS: "category_details",
  INDICATOR_DETAILS: "indicator_details",
  THRESHOLD: "threshold",
  CONSUMPTION: "consumption",
  INVESTMENT: "investment",
  FOOD_PRICE: "food_price",
  SUSTAINABILITY: "sustainability",
};

const OTHER_TABLE_REGEX = {
  COUNTRY: /country(.*?)list/i,
  MANIFEST: /manifest/i,
  CATEGORY_DETAILS: /category(.*?)details/i,
  INDICATOR_DETAILS: /indicator(.*?)details/i,
  ALERT_NOTIFICATIONS: /notification/i,
};

const ALERT_TABLE_REGEX = /alert/i;

const CATEGORY_TABLE_REGEX = {
  FOOD_SECURITY: /food(.*?)security/i,
  PRODUCTION_TRADE: /trade|production/i,
  CONSUMPTION:
    /consumption|food(.*?)balance|dietery(.*?)energy|energy(.*?)supply/i,
  INVESTMENT: /investment/i,
  FOOD_PRICE: /food(.*?)price/i,
  SUSTAINABILITY: /sustainability/i,
};

const CATEGORY_TABLE_UNITS = {
  FOOD_SECURITY: {
    "per capita food supply variability": "kcal/pc/d",
    "per capita food production variability": "1000 I$",
    unit: "%",
  },
  PRODUCTION_TRADE: {
    "gross production value": "1000 USD",
    "export value": "1000 USD",
    "export quantity": "t",
    "import value": "1000 USD",
    "import quantity": "t",
    yield: "(100 g/ha)",
    "area-harvested": "ha",
    production: "t",
  },
  CONSUMPTION: {
    "consumption per capita": "t/person/year", //2024_10_02
    //"average dietary energy supply adequacy": "percent",
    "share of dietary energy supply derived from cereals, roots and tubers":
      "kcal/cap/day",
    "average protein supply": "g/cap/day",
    "average fat supply": "g/cap/day",
    unit: "1000 t",
  },
  INVESTMENT: {
    unit: "million USD",
  },
  FOOD_PRICE: {
    "food price inflation": "percent",
    "consumer prices": "USD/Kg", //2024_10_02
    unit: "USD/tonne",
  },
  SUSTAINABILITY: {
    "share in land area": "%",
    unit: "%",
  },
};

module.exports = {
  TABLE_NAMES,
  ALERT_TABLE_REGEX,
  CATEGORY_TABLE_REGEX,
  OTHER_TABLE_REGEX,
  CATEGORY_TABLE_UNITS,
};
