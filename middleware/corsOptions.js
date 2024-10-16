const allowedOrigins = [
  "http://localhost:3000",
  "https://fso.nenafoodsecurity.org",
  "http://35.89.131.110",
];
const corsOptions = {
  origin: function (origin, callback) {
    console.log("[corsOptions.js--[8]], origin", origin);
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

module.exports = corsOptions;
