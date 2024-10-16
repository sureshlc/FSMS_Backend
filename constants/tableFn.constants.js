const { MONTH_NUMBERS } = require(".");
const { CATEGORY } = require("./category.constants");
const { CATEGORY_TABLE_UNITS } = require("./table.constants");

// for alerts we are setting the category if not present
const alertsTransformFn = (category) => (obj) => {
  const transformedObj = {
    ...obj,
    category: obj.category || category,
  };

  // Convert all keys to lowercase
  return Object.fromEntries(
    Object.entries(transformedObj).map(([key, value]) => [
      key.toLowerCase(),
      value,
    ])
  );
};

const genericElementTransformFn = (category) => (input) => {
  const { element, year, value, ...obj } = Object.fromEntries(
    Object.entries(input).map(([key, value]) => [key.toLowerCase(), value])
  );

  const newElement = element.replace(/\s*\([^)]*\)\s*/g, "").trim();

  const transformedObj = {
    ...obj,
    element: newElement,
    year: year,
    absolute_year: year.includes("-") ? year.split("-")[1] : year,
    unit:
      CATEGORY_TABLE_UNITS[category][newElement.toLowerCase()] ||
      CATEGORY_TABLE_UNITS[category]["unit"] ||
      "unit",
    value: parseFloat(value) || null,
  };

  return transformedObj;
};

const genericItemTransformFn = (category) => (input) => {
  const { item, year, value, ...obj } = Object.fromEntries(
    Object.entries(input).map(([key, value]) => [key.toLowerCase(), value])
  );

  const newItem = item.replace(/\s*\([^)]*\)\s*/g, "").trim();

  let objUnit = { ...obj }.unit;

  const transformedObj = {
    ...obj,
    item: newItem,
    year: year,
    absolute_year: year.includes("-") ? year.split("-")[1] : year,
    unit:
      objUnit ||
      CATEGORY_TABLE_UNITS[category][newItem.toLowerCase()] ||
      CATEGORY_TABLE_UNITS[category]["unit"] ||
      "unit",
    value: parseFloat(value) || null,
  };

  return transformedObj;
};

const consumptionTransformFn = (input) => {
  const { item, element, year, value, ...obj } = Object.fromEntries(
    Object.entries(input).map(([key, value]) => [key.toLowerCase(), value])
  );

  const newItem = item.replace(/\s*\([^)]*\)\s*/g, "").trim();
  const newElement = element.replace(/\s*\([^)]*\)\s*/g, "").trim();

  const transformedObj = {
    ...obj,
    item: newItem,
    element: newElement,
    year: year,
    absolute_year: year.includes("-") ? year.split("-")[1] : year,
    unit:
      CATEGORY_TABLE_UNITS.CONSUMPTION[newItem.toLowerCase()] ||
      CATEGORY_TABLE_UNITS.CONSUMPTION[newElement.toLowerCase()] ||
      CATEGORY_TABLE_UNITS.CONSUMPTION["unit"] ||
      "unit",
    value: parseFloat(value) || null,
  };

  return transformedObj;
};

const foodPriceTransformFn = (input) => {
  const { element, year, value, months, ...obj } = Object.fromEntries(
    Object.entries(input).map(([key, value]) => [key.toLowerCase(), value])
  );

  const newElement = element.replace(/\s*\([^)]*\)\s*/g, "").trim();

  // Get the numeric month value from the mapping
  const numericMonth = MONTH_NUMBERS[months?.toLowerCase()] || "00";

  // Calculate year_month based on absolute_year and numericMonth
  const absolute_year = year.includes("-") ? year.split("-")[1] : year;
  const yearMonth = `${absolute_year}-${numericMonth}`;

  const transformedObj = {
    ...obj,
    element: newElement,
    year,
    absolute_year,
    year_month: yearMonth, // Add the calculated year_month
    unit:
      CATEGORY_TABLE_UNITS.FOOD_PRICE[newElement.toLowerCase()] ||
      CATEGORY_TABLE_UNITS.FOOD_PRICE["unit"] ||
      "unit",
    value: parseFloat(value) || null,
  };

  return transformedObj;
};

const indicatorDetailsTransformFn = (obj) => {
  const parsedObj = {};

  Object.keys(obj).forEach((key) => {
    // Skip keys with empty string values
    if (obj[key] === "") {
      return;
    }

    try {
      // Check if the value is a string
      if (typeof obj[key] === "string") {
        // Attempt to parse the string as JSON
        parsedObj[key] = JSON.parse(obj[key].replace(/'/g, '"'));
      } else {
        // If it's not a string, just copy the value as is
        parsedObj[key] = obj[key];
      }
    } catch (error) {
      // If JSON.parse fails, retain the original string value
      parsedObj[key] = obj[key];
    }
  });

  return parsedObj;
};

// list table transform fn
const TABLE_TRANSFORM_FN = {
  INDICATOR_DETAILS: indicatorDetailsTransformFn,
  ALERTS: alertsTransformFn,
  FOOD_SECURITY: genericItemTransformFn(CATEGORY.FOOD_SECURITY),
  PRODUCTION_TRADE: genericElementTransformFn(CATEGORY.PRODUCTION_TRADE),
  CONSUMPTION: consumptionTransformFn,
  INVESTMENT: genericItemTransformFn(CATEGORY.INVESTMENT),
  FOOD_PRICE: foodPriceTransformFn,
  SUSTAINABILITY: genericElementTransformFn(CATEGORY.SUSTAINABILITY),
};

module.exports = TABLE_TRANSFORM_FN;
