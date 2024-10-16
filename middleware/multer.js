const multer = require("multer");
const RESPONSE = require("../common/response");
const logger = require("../common/logger");

/**
 * Creates a middleware function that handles file uploads using the specified multer instance.
 *
 * @param {function} multerInstance - The multer instance to use for file uploads.
 * @return {function} A middleware function that handles file uploads.
 */
const uploadHandler = (multerInstance) => (req, res, next) => {
  multerInstance(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      RESPONSE.ServerError(res, err);
    } else if (err) {
      RESPONSE.ServerError(res, { message: err.message });
    } else {
      logger.info("Uploaded file details:" + JSON.stringify(req.file));
      next();
    }
  });
};

module.exports = uploadHandler;
