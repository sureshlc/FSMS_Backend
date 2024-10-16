const AWS = require("aws-sdk");

// Connection parameters
const s3Client = new AWS.S3({
  accessKeyId: process.env.ENV_ACCESS_KEY_ID,
  secretAccessKey: process.env.ENV_SECRET_ACCESS_KEY,
  Bucket: process.env.ENV_S3_BUCKET_NAME,
});

module.exports = {
  s3Client,
};
