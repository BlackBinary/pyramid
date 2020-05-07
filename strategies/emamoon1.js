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

  //   logger.info(`Received update for timestamp ${candle.timestamp}`);
  //   logger.info(`Update price ${price}`);
  //   this.prices.push(price);

  //   const { length } = this.prices;
  //   if (length >= this.config.averageOver) {
  //     const lastIndex = length - 1;

  //     this.sma =

  //     logger.info(`sma  ${this.sma}`);
  //     logger.info(`prev ${this.previousSma}`);
  //     if (this.previousSma) {
  //       logger.info('We have enough data to begin trading');

  //       const smaDifference = this.sma - this.previousSma;

  //       logger.info(`SMA DIFF ${smaDifference}`);

  //       // This is not actually the current price
  //       const currentPrice = this.prices[lastIndex];

  //       if (smaDifference > this.config.buyAt) {
  //         logger.info(`SMA is up by ${smaDifference}`);
  //         if (this.main.portfolio.fiat > 0) {
  //           this.main.trade(this.main.portfolio.fiat, currentPrice, this.main.tradeTypes.BUY);
  //         }
  //       } else if (smaDifference < this.config.sellAt) {
  //         logger.info(`SMA is down by ${smaDifference}`);
  //         if (this.main.portfolio.crypto > 0) {
  //           this.main.trade(this.main.portfolio.crypto, currentPrice, this.main.tradeTypes.SELL);
  //         }
  //       }
  //     }

//     this.previousSma = this.sma;
//   }
};
