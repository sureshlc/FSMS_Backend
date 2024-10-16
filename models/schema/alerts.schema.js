const Joi = require("joi");
const { CATEGORY_LIST } = require("../../constants/category.constants");

const getAlerts = Joi.object({
  category: Joi.string()
    .insensitive()
    .valid(...CATEGORY_LIST)
    .optional(),
  year: Joi.string().allow(null).optional(),
  area: Joi.string().allow(null).optional(),
  threshold: Joi.boolean().allow(null).optional(),
  sort: Joi.number().valid(1, -1).allow(null).optional(),
  trend: Joi.boolean().allow(null).optional(),
});

const getCategoryTrend = Joi.object({
  category: Joi.string()
    .insensitive()
    .valid(...CATEGORY_LIST)
    .required(),
  area: Joi.string().allow(null).optional(),
  threshold: Joi.boolean().allow(null).optional(),
  fromYear: Joi.string().allow(null).optional(),
  forecast: Joi.number().min(0).max(3).allow(null).optional(),
  sort: Joi.number().valid(1, -1).allow(null).optional(),
});

const getAlertNotifications = Joi.object({
  category: Joi.string()
    .insensitive()
    .valid(...CATEGORY_LIST)
    .optional()
    .allow(null),
});

module.exports = {
  getAlerts,
  getAlertNotifications,
  getCategoryTrend,
};
