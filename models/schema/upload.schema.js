const Joi = require("joi");

const uploadSchema = Joi.object({
  tableName: Joi.string().allow(null).optional(),
});

module.exports = {
  uploadSchema,
};
