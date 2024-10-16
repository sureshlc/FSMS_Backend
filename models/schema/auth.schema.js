const Joi = require("joi");

const signUpUser = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

const loginUser = Joi.object({
  username: Joi.string().allow("").required(),
  password: Joi.string().allow("").required(),
});

module.exports = {
  signUpUser,
  loginUser,
};
