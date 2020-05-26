/**
 * Calculate the simple moving average
 *
 * @link https://en.wikipedia.org/wiki/Moving_average
 *
 * @class
 * @classdesc Calculate the simple moving average
 */

class Indicator {
  /**
   * Class constructor
   * @param {Number} window The window to use for the calculatation
   */
  constructor(window) {
    this.result = null;
    this.prices = [];
    this.window = window;
  }

  /**
   * On update of the indicator
   * @param {Number} price Current price
   * @returns {Number} Current SMA
   */
  update(price) {
    // Run the calculation over the update price
    this.calculate(price);

    // Return the result
    return this.result;
  }

  /**
   * Calculate the SMA
   * @param {Number} price Current price
   */
  calculate(price) {
    // Add the new price to the end
    this.prices.push(price);
    // If the array of prices is equals to the window we need to calculate over
    if (this.prices.length === this.window) {
      // Calulcate the average over the last X prices
      this.result = this.sum() / this.window;

      // Remove the first item from the array
      this.prices.shift();
    } else {
      // If we can't calculate the SMA over the window, calculate it over the available prices
      this.result = this.sum() / this.prices.length;
    }
  }

  /**
   * Sum
   * @returns {Number} Returns a sum of this.prices
   */
  sum() {
    return this.prices.reduce((a, b) => a + b, 0);
  }
}


module.exports = Indicator;
