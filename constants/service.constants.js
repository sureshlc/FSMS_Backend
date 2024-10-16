const S3_LIST_OBJECT_REQUEST = {
  Bucket: process.env.ENV_S3_BUCKET_NAME,
  Prefix: "index/",
  StartAfter: "index/",
};

const S3_INDEX_REGEX = /index\//i;

module.exports = {
  S3_LIST_OBJECT_REQUEST,
  S3_INDEX_REGEX,
};
