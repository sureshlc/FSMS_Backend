const { Model } = require("sequelize");

class TableDetails {
  /**
   * Constructor function for the class.
   *
   * @param {String} tableName - The name of the table.
   * @param {Model} tableModel - The model of the table.
   * @param {String} category - The category of the table.
   */
  constructor(tableName = null, tableModel = null, category = null) {
    Object.assign(this, {
      _tableName: tableName,
      _tableModel: tableModel,
      _category: category,
    });
  }

  get tableName() {
    return this._tableName;
  }
  set tableName(value) {
    this._tableName = value;
  }

  get tableModel() {
    return this._tableModel;
  }
  set tableModel(value) {
    this._tableModel = value;
  }

  get category() {
    return this._category;
  }
  set category(value) {
    this._category = value;
  }
}

module.exports = {
  TableDetails,
};
