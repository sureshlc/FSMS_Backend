const multer = require("multer");
const path = require("path");

const UPLOAD_FILE_LOCATION = "uploads/";

const storage = multer.diskStorage({
  /**
   * Upload storage destination
   */
  destination: function (req, file, cb) {
    cb(null, UPLOAD_FILE_LOCATION);
  },

  /**
   * Upload file name
   */
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

/**
 * Upload file filter
 */
const filter = (req, file, cb) => {
  if (
    file.mimetype === "text/csv" ||
    file.mimetype === "text/xlsx" ||
    file.mimetype === "application/vnd.ms-excel" || // For older Excel formats
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" // For newer Excel formats (XLSX)
  ) {
    cb(null, true);
  } else {
    // Reject other file types
    cb(new Error("Only CSV and Excel files are allowed"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: filter,
});

// csv implementation
const csvUpload = upload.single("csvFile");

module.exports = csvUpload;
