/**
 * Calculate the exponential moving average
 *
 * @link https://en.wikipedia.org/wiki/Moving_average
 *
 * @class
 * @classdesc Calculate the exponential moving average
 */

class Indicator {
  /**
   * Class constructor
   * @param {Number} weight The weight to use in the calculation
   */
  constructor(weight) {
    this.weight = weight;
    this.result = null;
    this.age = 0;
  }

  /**
   * On update of the indicator
   * @param {Number} price Current price
   * @returns {Number} Current EMA
   */
  update(price) {
    // The first time we don't have anything to calculate
    if (this.age === 0) {
      // Set the result to the price
      this.result = price;
    }

    // Up the age by 1
    this.age += 1;

    // Run the calculation over the update price
    this.calculate(price);

    // Return the result
    return this.result;
  }

  /**
   * Calculate the EMA
   * @param {Number} price Current price
   */
  calculate(price) {
    // Calculate the weight factor
    const k = 2 / (this.weight + 1);

    // Do the calculation of the EMA
    this.result = price * k + this.result * (1 - k);
  }
}


module.exports = Indicator;
