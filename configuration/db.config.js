const { Sequelize } = require("sequelize");
const logger = require("../common/logger");

// Connection parameters
const sequelize = new Sequelize(
  process.env.POSTGRES_DATABASE,
  process.env.POSTGRES_DATABASE_USER,
  process.env.POSTGRES_DATABASE_PASSWORD,
  {
    host: "localhost",
    dialect: "postgres",
    port: 5432,
    // TODO: add custom logger here for SQL queries
    // logging: (msg) => logger.info(msg),
    timestamps: false,
  }
);

const testDbConnection = async () => {
  try {
    await sequelize.authenticate();
    logger.info("DB Connection Successful");
  } catch (error) {
    logger.error("Unable to connect to the database:", error);
  }
};

module.exports = { sq: sequelize, testDbConnection };
