const { sq } = require("../../configuration/db.config");
const { DataTypes } = require("sequelize");

/**
 * @description
 * DB model for thresholds.
 * Stores the threshold values for combinations of category, area, element and item
 *
 */

const Threshold = sq.define(
  "thresholds",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    category_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    area: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    element: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    item: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mean_value: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    standard_deviation: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    indexes: [
      {
        fields: ["category_id", "area"],
      },
    ],
  }
);

module.exports = Threshold;
