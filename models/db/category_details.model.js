const { sq } = require("../../configuration/db.config");
const { DataTypes } = require("sequelize");

/**
 * @description
 * DB model for category_details.
 * Stores category details for creating CategoryDetails entities
 *
 */
const CategoryDetails = sq.define(
  "category_details",
  {
    category_id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    display_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    column: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    unit: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    trend_indicator: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = CategoryDetails;
