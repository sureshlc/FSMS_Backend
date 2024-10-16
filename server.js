const express = require("express");
// dotenv
const dotenv = require("dotenv");
dotenv.config();

// body parser
const bodyParser = require("body-parser");

// cors
const cors = require("cors");

// db
const { testDbConnection } = require("./configuration/db.config");

// routes
const routes = require("./routes");

// http
const httpLogger = require("./middleware/httplogger");
const logger = require("./common/logger");
const corsOptions = require("./middleware/corsOptions");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());

app.use(bodyParser.json());
app.use(httpLogger);

// test Db connection
testDbConnection();

routes(app);

app.listen(PORT, () => {
  logger.info("SERVER STARTED ON PORT " + PORT);
});
