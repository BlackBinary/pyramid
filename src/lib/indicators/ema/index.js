/**
 * Calculate the EMA
 *
 * @param {Number} over - The amount to calculate EMA over
 * @param {Number} price - The current price
 * @param {Number} previousEma - The previous EMA
 * @returns {Number}
 */
module.exports = (over = 0, price = 0, previousEma = 0) => {
  const smoothing = 2 / (over + 1);

  return (price - previousEma) * smoothing + previousEma;
};
