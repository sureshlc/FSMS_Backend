const logger = require("../common/logger");

/**
 * Retrieves a list of S3 objects based on the provided listObjectRequest.
 *
 * @param {Object} s3Client - The AWS S3 client.
 * @param {Object} listObjectRequest - The request object containing parameters to list the S3 objects.
 * @return {Promise<Object>} - A promise that resolves to the list of S3 objects.
 * @throws {Error} - If an error occurs while listing the S3 objects.
 */
exports.listS3Objects = async (s3Client, listObjectRequest) => {
  try {
    return s3Client.listObjectsV2(listObjectRequest).promise();
  } catch (error) {
    logger.error("Error listing S3 objects:", error);
    throw error;
  }
};

/**
 * Retrieves an S3 object based on the provided getObjectRequest.
 *
 * @param {Object} s3Client - The AWS S3 client.
 * @param {Object} getObjectRequest - The request object containing the parameters for getObject.
 * @return {Promise<Object>} - A promise that resolves to the retrieved S3 object.
 * @throws {Error} - If an error occurs while getting the S3 object.
 */
exports.getS3Object = async (s3Client, getObjectRequest) => {
  try {
    return s3Client.getObject(getObjectRequest).promise();
  } catch (error) {
    logger.error("Error getting S3 object:", error);
    throw error;
  }
};

/**
 * Returns a readable stream for an S3 object.
 *
 * @param {Object} s3Client - The AWS S3 client.
 * @param {Object} getObjectRequest - The request object for getting the S3 object.
 * @return {Stream} The readable stream for the S3 object.
 * @throws {Error} If an error occurs while getting the S3 object.
 */
exports.getS3ObjectStream = (s3Client, getObjectRequest) => {
  try {
    return s3Client.getObject(getObjectRequest).createReadStream();
  } catch (error) {
    logger.error("Error getting S3 object stream:", error);
    throw error;
  }
};
