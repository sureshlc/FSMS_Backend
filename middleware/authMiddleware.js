const jwt = require("jsonwebtoken");
const RESPONSE = require("../common/response");
const { SECRET_KEY } = require("../configuration/auth.config");

/**
 * Middleware to verify the authentication token in the request header.
 *
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @param {Function} next - the next function to be called
 * @return {void}
 */
const authToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return RESPONSE.Unauthorized(res, { message: "No token provided" });
  }

  try {
    let token;
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else {
      // token is provided directly
      token = authHeader;
    }

    const decoded = jwt.verify(token, SECRET_KEY);
    console.log(decoded);
    req.userId = decoded.userId;
    req.user = decoded.user;
    next();
  } catch (error) {
    console.error(error);
    return RESPONSE.Unauthorized(res, error);
  }
};

module.exports = {
  authToken,
};
