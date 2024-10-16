class IndicatorDetails {
  /**
   * Constructor for creating a new instance of the class.
   *
   * @param {String} name
   * @param {String} unit
   * @param {String} column - column of the indicator
   * @param {Array<String>} items - items in the indicator
   * @param {Array<String>} commodities - commodities
   * @param {Array<String>} legends - legends
   * @param {boolean} isPositive - is increase positive or not
   * @param {number} noOfDimensions - no of dimensions
   * @param {boolean} is2dData - is 2d data or not
   * @param {String} thresholdDisplay - display threshold for each or all countries
   * @param {boolean} is3YearAverage - is it 3 year average
   */
  constructor(
    name,
    unit,
    column,
    items,
    commodities,
    legends,
    isPositive,
    noOfDimensions,
    is2dData,
    thresholdDisplay,
    is3YearAverage = false
  ) {
    this.name = name;
    this.unit = unit;
    this.column = column;
    this.items = items;
    this.commodities = commodities;
    this.legends = legends;
    this.isPositive = isPositive;
    this.noOfDimensions = noOfDimensions;
    this.is2dData = is2dData;
    this.thresholdDisplay = thresholdDisplay;
    this.is3YearAverage = is3YearAverage;
  }

  // Additional methods and getters/setters can be added as needed
}

module.exports = IndicatorDetails;
