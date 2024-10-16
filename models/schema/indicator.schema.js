const Joi = require("joi");
const { CATEGORY_LIST } = require("../../constants/category.constants");

const getIndicatorData = Joi.object({
  category: Joi.string()
    .insensitive()
    .valid(...CATEGORY_LIST)
    .required(),
  indicator: Joi.string().required(),
  commodity: Joi.string().allow(null).optional(),
  area: Joi.string().allow(null).optional(),
  fromYear: Joi.string().allow(null).optional(),
  forecast: Joi.number().min(0).max(3).allow(null).optional(),
  sort: Joi.number().valid(1, -1).allow(null).optional(),
});

module.exports = {
  getIndicatorData,
};
