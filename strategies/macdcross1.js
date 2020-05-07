/**
 * MACD CROSS 1
 * Author: Daen Rebel
 *
 * This strategy works
 *
 * Strategy
 * Calc MACD over primed datapoints, and wait for at least 1 real datapoint
 * When MACD pos buy. When MACD neg sell
 */

const logger = require('@lib/logger').scope('macd cross 1');

module.exports.config = {
  prime: true,
  fastAverage: 12,
  slowAverage: 26,
  // buyAt: 20,
  //   sellAt: -2,
  startAt: 9,
  tradeSignal: 'close',
  backtesting: {
    portfolio: {
      fiat: 1000,
      crypto: 0,
    },
  },
};

module.exports.weightingMultiplier = (over) => 2 / (over + 1);

module.exports.prices = [];

module.exports.fastAverage = null;
module.exports.slowAverage = null;

module.exports.init = (_this) => {
  // Find a better solution to get parrent functions
  this.main = _this;

  // If we're trading with primer
  if (this.main.primeCandles) {
    this.prices = this.main.primeCandles
      .reverse()
      .map(([time, low, high, open, close, volume]) => ({
        time, low, high, open, close, volume,
      }))
      .map((obj) => obj[this.config.tradeSignal]);
  }

  this.fast = null;
  this.slow = null;
  this.signal = null;

  this.macdIndex = 0;

  // Log
  logger.info('Starting strategy');
};

module.exports.calculateSma = (prices, over) => prices.slice((prices.length - 1) - over, -1).reduce((a, b) => a + b, 0) / over;

module.exports.calculateEma = (price, currentEma, over) => (price - currentEma) * this.weightingMultiplier(over) + currentEma;

module.exports.update = (candle) => {
  const price = candle[this.config.tradeSignal];
  this.prices.push(price);

  const { length } = this.prices;
  if (length >= this.config.slowAverage && length >= this.config.fastAverage) {
    if (!this.fastAverage && !this.slowAverage) {
      this.fastAverage = this.calculateSma(this.prices, this.config.fastAverage);
      this.slowAverage = this.calculateSma(this.prices, this.config.slowAverage);
    } else {
      this.fastAverage = this.calculateEma(price, this.fastAverage, this.config.fastAverage);
      this.slowAverage = this.calculateEma(price, this.slowAverage, this.config.slowAverage);
    }

    // logger.info(`Fast average ${this.fastAverage}`);
    // logger.info(`Slow average ${this.slowAverage}`);

    const macd = this.fastAverage - this.slowAverage;

    if (macd > 22) {
      if (this.main.portfolio.fiat > 0) {
        logger.info('We should buy');
        this.main.trade(this.main.portfolio.fiat, price, this.main.tradeTypes.BUY);
      }
    } else if (macd < -4) {
      if (this.main.portfolio.crypto > 0) {
        logger.info('We should sell');
        this.main.trade(this.main.portfolio.crypto, price, this.main.tradeTypes.SELL);
      }
    }
  }
};
