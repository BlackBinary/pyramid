/**
 * Calculate the SMA over a X count of prices
 *
 * @param {Number} over - The amount to calculate SMA over
 * @param {Array} prices - Array of prices
 * @returns {Number}
 */
module.exports = (over = 0, prices = []) => {
  const calculateOver = prices.slice((prices.length - 1) - over, -1);

  return calculateOver.reduce((a, b) => a + b, 0) / over;
};
