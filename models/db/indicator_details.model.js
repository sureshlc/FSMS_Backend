const { sq } = require("../../configuration/db.config");
const { DataTypes } = require("sequelize");

/**
 * @description
 * DB model for indicator_details.
 * Stores indicator details for creating IndicatorDetails entities
 *
 */

const IndicatorDetails = sq.define(
  "indicator_details",
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
    indicator_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    unit: {
      type: DataTypes.STRING,
    },
    column: {
      type: DataTypes.STRING,
    },
    items: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: null,
    },
    commodities: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: null,
    },
    legends: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: null,
    },
    is_positive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    no_of_dimensions: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    is_2d_data: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    threshold_display: {
      type: DataTypes.STRING,
      defaultValue: "COUNTRY",
    },
    is_3y_avg: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: false,
    indexes: [
      {
        fields: ["indicator_name"],
      },
    ],
  }
);

module.exports = IndicatorDetails;
