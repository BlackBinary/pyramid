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

const logger = require('@lib/logger').scope('simple 1');

module.exports.config = {
  buyAt: 60,
  sellAt: -80,
  backtesting: {
    tradeSignal: 'low',
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
  const previousPrice = this.main.data.price[i - 1];
  const currentPrice = this.main.data.price[i];

  // Make sure we actually have a price to compage against
  if (previousPrice) {
    const difference = previousPrice - currentPrice;
    if (difference > this.config.buyAt) {
      logger.info('Price pos. Buy');
      logger.info(difference);
      if (this.main.portfolio.fiat > 0) {
        this.main.trade(this.main.portfolio.fiat, currentPrice, this.main.tradeTypes.BUY);
      }
    } else if (difference < this.config.sellAt) {
      logger.info('Price neg. Sell');
      logger.info(difference);
      if (this.main.portfolio.crypto > 0) {
        this.main.trade(this.main.portfolio.crypto, currentPrice, this.main.tradeTypes.SELL);
      }
    }
  }
};
