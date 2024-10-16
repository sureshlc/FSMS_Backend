const { sq } = require("../../configuration/db.config");
const { DataTypes } = require("sequelize");

/**
 * @description
 * DB model for alerts.
 * Stores alerts and associated ranks with each category and country.
 *
 */

const Alerts = sq.define(
  "alerts",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    area: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cluster: {
      type: DataTypes.INTEGER,
    },
    rank: {
      type: DataTypes.INTEGER,
    },
    threshold: {
      type: DataTypes.BOOLEAN,
    },
    year: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["area", "category"],
      },
    ],
  }
);

module.exports = Alerts;
