const { Op } = require("sequelize");
const RESPONSE = require("../common/response");
const DB_MODEL = require("../models/index.model");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../configuration/auth.config");

/**
 * Handle user sign up process.
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @return {Promise} A promise that resolves when the sign up process is complete
 */
exports.signUp = async (req, res) => {
  const query = req.body;
  try {
    const { username, email, password } = query;

    // Check if username or email already exist
    const existingUser = await DB_MODEL.USER.findOne({
      where: { [Op.or]: [{ username }, { email }] },
    });

    if (existingUser) {
      return RESPONSE.BadRequest(res, {
        message: "username or email already exists",
      });
    }

    // create user
    await DB_MODEL.USER.create({
      username: username,
      email: email,
      password: password, // auto hashes the password
    });

    RESPONSE.Created(res, {
      message: "user created successfully",
    });
  } catch (error) {
    console.error(error);
    RESPONSE.ServerError(res, { message: error.message });
  }
};

/**
 * User login function that handles user authentication and token generation.
 *
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @return {jwt token} Bearer token
 */
exports.login = async (req, res) => {
  const query = req.body;
  try {
    const { username, password } = query;

    // Check if user exists
    const user = await DB_MODEL.USER.findOne({ where: { username } });
    if (!user) {
      return RESPONSE.Unauthorized(res, {
        message: "Invalid username or password", //2024_10_02
      });
    }

    // Check if password is correct
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return RESPONSE.Unauthorized(res, {
        message: "Invalid email or password",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, user: user.username },
      SECRET_KEY,
      {
        expiresIn: "6h",
      }
    );

    RESPONSE.Success(res, {
      userId: user.id,
      username: user.username,
      accessToken: token,
    });
  } catch (error) {
    console.error(error);
    RESPONSE.ServerError(res, { message: error.message });
  }
};
