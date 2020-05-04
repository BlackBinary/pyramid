/**
 * SIMPLE 1
 * Author: Daen Rebel
 *
 * This strategy IS A TEST! DO NOT USE IT
 *
 * Strategy
 * Get difference between current and last closing price
 * Buy if difference between current and previous price is higher than 1
 * Sell if difference between current and previous price is higher than -1
 */

const logger = require('@lib/logger');

module.exports.config = {
  buyAt: 60,
  sellAt: -80,
  backtesting: {
    portfolio: {
      fiat: 1000,
      crypto: 0,
    },
  },
};

module.exports.init = (_this) => {
  // Set the main to the caller
  this.main = _this;
};

module.exports.update = (i) => {
  const previousClosePrice = this.main.data.close[i - 1];
  const currentClosePrice = this.main.data.close[i];

  const currentHigh = this.main.data.high[i];

  // Make sure we actually have a price to compage against
  if (previousClosePrice) {
    const difference = previousClosePrice - currentClosePrice;
    if (difference > this.config.buyAt) {
      logger.info('Price pos. Buy');
      logger.info(difference);
      if (this.main.portfolio.fiat > 0) {
        this.main.trade(this.main.portfolio.fiat, currentHigh, this.main.tradeTypes.BUY);
      }
    } else if (difference < this.config.sellAt) {
      logger.info('Price neg. Sell');
      logger.info(difference);
      if (this.main.portfolio.crypto > 0) {
        this.main.trade(this.main.portfolio.crypto, currentHigh, this.main.tradeTypes.SELL);
      }
    }
  }
};
