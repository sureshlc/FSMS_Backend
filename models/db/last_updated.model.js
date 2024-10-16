const { sq } = require("../../configuration/db.config");
const { DataTypes } = require("sequelize");

/**
 * @description
 * DB model for last_updateds.
 * Stores when the db was last updated
 *
 */

const LastUpdated = sq.define(
  "last_updateds",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = LastUpdated;
