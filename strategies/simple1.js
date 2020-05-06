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
  tradeSignal: 'low',
  backtesting: {
    portfolio: {
      fiat: 1000,
      crypto: 0,
    },
  },
};

module.exports.init = (_this) => {
  // Find a better solution to get parrent functions
  this.main = _this;

  // Log
  logger.info('Starting strategy');
};

module.exports.update = (candle) => {
  this.price = candle[this.config.tradeSignal];

  // Make sure we actually have a price to compage against
  if (this.previousPrice) {
    const difference = this.previousPrice - this.price;
    if (difference > this.config.buyAt) {
      logger.info('Price pos. Buy');
      logger.info(difference);
      if (this.main.portfolio.fiat > 0) {
        this.main.trade(this.main.portfolio.fiat, this.price, this.main.tradeTypes.BUY);
      }
    } else if (difference < this.config.sellAt) {
      logger.info('Price neg. Sell');
      logger.info(difference);
      if (this.main.portfolio.crypto > 0) {
        this.main.trade(this.main.portfolio.crypto, this.price, this.main.tradeTypes.SELL);
      }
    }
  }

  this.previousPrice = this.price;
};
