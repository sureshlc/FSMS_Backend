const Joi = require("joi");
const { CATEGORY_LIST } = require("../../constants/category.constants");

const calcForGivenCategory = Joi.object({
  category: Joi.string()
    .insensitive()
    .valid(...CATEGORY_LIST)
    .optional(),
});

module.exports = {
  calcForGivenCategory,
};
