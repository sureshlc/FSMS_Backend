const { sq } = require("../../configuration/db.config");
const { DataTypes } = require("sequelize");

/**
 * @description
 * DB model for manifests.
 * Stores the list of files that are already available and parsed
 *
 */

const Manifest = sq.define(
  "manifests",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.CITEXT,
      allowNull: false,
    },
    tag: {
      type: DataTypes.CITEXT,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Manifest;
