const { DataTypes } = require("sequelize");
const { sq } = require("../../configuration/db.config");

/**
 * @description
 * DB model for category_trends.
 * Stores trends for a given category and area along with latest year and change percentages
 *
 */

const CategoryTrends = sq.define(
  "category_trends",
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
    year: {
      type: DataTypes.STRING,
    },
    value: {
      type: DataTypes.FLOAT,
    },
    yearly_change: {
      type: DataTypes.FLOAT,
    },
    yearly_change_percentage: {
      type: DataTypes.FLOAT,
    },
    latest_year: {
      type: DataTypes.STRING,
    },
    latest_year_change_percentage: {
      type: DataTypes.FLOAT,
    },
    is_positive: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    timestamps: false,
    indexes: [
      {
        fields: ["category_id", "area"],
      },
    ],
  }
);

module.exports = CategoryTrends;
