const { sq } = require("../../configuration/db.config");
const { DataTypes } = require("sequelize");

/**
 * @description
 * DB model for food_security.
 *
 */

const FoodSecurity = sq.define(
  "food_securities",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    domain: {
      type: DataTypes.STRING,
    },
    area: {
      type: DataTypes.STRING,
    },
    element: {
      type: DataTypes.STRING,
    },
    item: {
      type: DataTypes.STRING,
    },
    year: {
      type: DataTypes.STRING,
    },
    absolute_year: {
      type: DataTypes.STRING,
    },
    value: {
      type: DataTypes.FLOAT,
    },
    unit: {
      type: DataTypes.STRING,
    },
    is_forecast: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    yearly_change: {
      type: DataTypes.FLOAT,
    },
  },
  {
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["area", "element", "item", "absolute_year"],
      },
    ],
  }
);

module.exports = FoodSecurity;
