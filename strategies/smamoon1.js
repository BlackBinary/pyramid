/**
 * SMA MOON 1
 * Author: Daen Rebel
 *
 * This strategy seems to work. I need someone to help me verify
 *
 * Strategy
 * Get SMA over last 5 prices
 * Buy if difference between current and previous average is above 8
 * Sell if difference between current and previous average is below -19
 */

const logger = require('@lib/logger').scope('sma moon 1');

module.exports.config = {
  averageOver: 5,
  buyAt: 10,
  sellAt: -21,
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

  this.prices = [];

  // Log
  logger.info('Starting strategy');
};

module.exports.update = (candle) => {
  // logger.info(`Received update for timestamp ${candle.timestamp}`);
  this.prices.push(candle[this.config.tradeSignal]);

  const { length } = this.prices;
  if (length >= this.config.averageOver) {
    const lastIndex = length - 1;
    this.sma = this.prices.slice(lastIndex - this.config.averageOver, -1).reduce((a, b) => a + b, 0) / this.config.averageOver;
    if (this.previousSma) {
      const smaDifference = this.sma - this.previousSma;

      // This is not actually the current price
      const currentPrice = this.prices[lastIndex];

      if (smaDifference > this.config.buyAt) {
        logger.info(`Closing SMA is up by ${smaDifference}`);
        if (this.main.portfolio.fiat > 0) {
          this.main.trade(this.main.portfolio.fiat, currentPrice, this.main.tradeTypes.BUY);
        }
      } else if (smaDifference < this.config.sellAt) { // If the difference is a negative number, do something (sell?)
        logger.info(`Closing SMA is down by ${smaDifference}`);
        if (this.main.portfolio.crypto > 0) {
          this.main.trade(this.main.portfolio.crypto, currentPrice, this.main.tradeTypes.SELL);
        }
      }
    }

    this.previousSma = this.sma;
  }

  // if (i < this.config.averageOver) {
  //   logger.info(`We need at least ${this.config.averageOver} datapoints to use SMA. Please wait.`);
  //   logger.info(`Skipping index ${i} because it's out of our data range`);
  // } else {
  //   // Get the current and the previous result
  //   const currentSma = this.sma[i];
  //   const previousSma = this.sma[i - 1];

  //   // Get the difference between
  //   const smaDifference = currentSma - previousSma;

  //   // Get the current and the previous price
  //   const currentPrice = this.main.data.price[i];

  //   // If the difference is a positive number, do something (buy?)

  // logger.info(`Price Previous: ${previousPrice}`);
  // logger.info(`Price Current:  ${currentPrice}`);

  // logger.info(`SMA Previous: ${previousSma}`);
  // logger.info(`SMA Current:  ${currentSma}`);
  // }
};
