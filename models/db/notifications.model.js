const { sq } = require("../../configuration/db.config");
const { DataTypes } = require("sequelize");

/**
 * @description
 * DB model for alert_notifications.
 * Stores alert notifications for different categories and areas
 *
 */

const AlertNotifications = sq.define(
  "alert_notifications",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    area: {
      type: DataTypes.STRING,
    },
    year: {
      type: DataTypes.STRING,
    },
    month: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: true,
    indexes: [
      {
        fields: ["category"],
      },
    ],
  }
);

module.exports = AlertNotifications;
