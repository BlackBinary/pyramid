/**
 * EMA MOON 1
 * Author: Daen Rebel
 *
 * This strategy seems to work. I need someone to help me verify
 *
 * Strategy
 * NONE
 */

const logger = require('@lib/logger').scope('ema moon 1');

module.exports.config = {
  prime: true,
  averageOver: 5,
  //   buyAt: 2,
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

module.exports.weightingMultiplier = 2 / (this.config.averageOver + 1);

module.exports.init = (_this) => {
  // Find a better solution to get parrent functions
  this.main = _this;

  this.main.primeCandles.map(({ }));

  this.prices = [];

  this.ema = null;
  this.emaIndex = 0;

  // Log
  logger.info('Starting strategy');
};

module.exports.update = (candle) => {
  const price = candle[this.config.tradeSignal];
  this.prices.push(price);

  const { length } = this.prices;
  if (length >= this.config.averageOver) {
    const lastIndex = length - 1;
    // We have no ema yet
    if (!this.ema) {
      // Set the ema to the sma for the first time
      this.ema = this.prices.slice(lastIndex - this.config.averageOver, -1).reduce((a, b) => a + b, 0) / this.config.averageOver;
    } else {
      const currentEma = this.ema;
      this.ema = (price - currentEma) * this.weightingMultiplier + currentEma;
      this.emaIndex += 1;
    }

    if (this.emaIndex >= this.config.startAt) {
      // We have an accurate ema enough to do stuff
    }
  }
};
