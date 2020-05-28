const EMA = require('./EMA');

/**
 * Calculate the moving average convergence/divergence
 *
 * @link https://en.wikipedia.org/wiki/MACD
 *
 * @class
 * @classdesc Calculate the moving average convergence/divergence
 */

class Indicator {
  /**
   * Class constructor
   * @param {Number} short Short EMA
   * @param {Number} long Long EMA
   * @param {Number} signal Signal EMA
   */
  constructor(short, long, signal) {
    this.result = null;
    this.difference = null;
    this.short = new EMA(short);
    this.long = new EMA(long);
    this.signal = new EMA(signal);
  }

  /**
   * On update of the indicator
   * @param {Number} price Current price
   * @returns {Number} Current SMA
   */
  update(price) {
    // Update both the EMA for the short and long lines
    this.short.update(price);
    this.long.update(price);

    // Calculate the difference between the short and long EMA
    this.calculateDifference();

    // Update the signal line with the calculated difference
    this.signal.update(this.difference);

    // Create a new result
    this.result = this.difference - this.signal.result;

    // Return the result
    return this.result;
  }

  /**
   * Calculate the Difference between the long and short EMA
   */
  calculateDifference() {
    this.difference = this.short.result - this.long.result;
  }
}


module.exports = Indicator;
