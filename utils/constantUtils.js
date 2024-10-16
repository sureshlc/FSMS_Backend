const TABLE_TRANSFORM_FN = require("../constants/tableFn.constants");
const DB_MODEL = require("../models/index.model");

/**
 * Utility functions for accessing constant objects
 */

const getTableModel = (name) => {
  return DB_MODEL[name.toUpperCase()] || null;
};

const getTableTransformFn = (category) => {
  return TABLE_TRANSFORM_FN[category.toUpperCase()] || ((k) => k);
};

const CONST_UTILS = {
  TABLE_MODEL: getTableModel,
  TABLE_TRANSFORM_FN: getTableTransformFn,
};

module.exports = CONST_UTILS;
