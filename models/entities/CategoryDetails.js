class CategoryDetails {
  /**
   * Constructor for creating a new instance of the class.
   *
   * @param {String} name
   * @param {String} displayName
   * @param {String} defaultUnit
   * @param {String} defaultColumn
   * @param {String} trendIndicator - indicator thatr signifies trend
   * @param {String} indicatorDetails - indicator details
   */
  constructor(
    name,
    displayName,
    defaultUnit,
    defaultColumn,
    trendIndicator,
    indicatorDetails
  ) {
    this.name = name;
    this.displayName = displayName;
    this.defaultUnit = defaultUnit;
    this.defaultColumn = defaultColumn;
    this.trendIndicator = trendIndicator;
    this.indicatorDetails = indicatorDetails;
  }
  setIndicatorDetails(value) {
    this.indicatorDetails = value;
  }

  /**
   * Check if the indicator details and column are available.
   *
   * @return {boolean} availability of indicator details and column
   */
  isAvailable() {
    return this?.indicatorDetails && this?.indicatorDetails?.column;
  }
}

module.exports = CategoryDetails;
