const { sq } = require("../../configuration/db.config");
const { DataTypes } = require("sequelize");

/**
 * @description
 * DB model for countries.
 * Stores country details
 *
 */

const Country = sq.define(
  "countries",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    area: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    iso3_code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    latitude: {
      type: DataTypes.FLOAT,
    },
    longitude: {
      type: DataTypes.FLOAT,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Country;
