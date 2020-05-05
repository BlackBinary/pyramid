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

// const tulind = require('tulind');

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

module.exports.init = () => {
  // // Get the SMA indicators
  // tulind.indicators.sma.indicator([this.main.data.price], [this.config.averageOver], (err, results) => {
  //   // Get the results
  //   const [closingSma] = results;
  //   this.sma = closingSma;
  // });

  // Log
  logger.info('Starting strategy');
};

module.exports.update = (i) => {
  logger.info(`Received update for index ${i}`);
  return this.getCandleRange(this.timestamp, this.config.tradeSignal, i, i + this.config.averageOver, (error, response) => {
    if (error) logger.error(error);
    else if (response.length > this.config.averageOver) {
      logger.info('can do calc');
    }
    return true;
  });
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
  //   if (smaDifference > this.config.buyAt) {
  //     logger.info(`Closing SMA is up by ${smaDifference}`);
  //     if (this.main.portfolio.fiat > 0) {
  //       this.main.trade(this.main.portfolio.fiat, currentPrice, this.main.tradeTypes.BUY);
  //     }
  //   } else if (smaDifference < this.config.sellAt) { // If the difference is a negative number, do something (sell?)
  //     logger.info(`Closing SMA is down by ${smaDifference}`);
  //     if (this.main.portfolio.crypto > 0) {
  //       this.main.trade(this.main.portfolio.crypto, currentPrice, this.main.tradeTypes.SELL);
  //     }
  //   }

  // logger.info(`Price Previous: ${previousPrice}`);
  // logger.info(`Price Current:  ${currentPrice}`);

  // logger.info(`SMA Previous: ${previousSma}`);
  // logger.info(`SMA Current:  ${currentSma}`);
  // }
};
