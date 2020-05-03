const tulind = require('tulind');

const logger = require('@lib/logger');

module.exports.config = {
  averageOver: 5,
  buyAt: 8,
  sellAt: -19,
  backtesting: {
    portfolio: {
      usd: 1000,
      btc: 0,
    },
  },
};

module.exports.init = (_this) => {
  // Set the main to the caller
  this.main = _this;

  // Get the SMA indicators
  tulind.indicators.sma.indicator([this.main.data.close], [this.config.averageOver], (err, results) => {
    // Get the results
    const [closingSma] = results;
    this.sma = closingSma;
  });
};

module.exports.update = (i) => {
  // logger.info(`Received update for index ${i}`);
  if (i < this.config.averageOver) {
    logger.info(`Skipping index ${i} because it's out of our data range`);
  } else {
    // Get the current and the previous result
    const currentSma = this.sma[i];
    const previousSma = this.sma[i - 1];

    // Get the difference between
    const smaDifference = currentSma - previousSma;

    // Get the current and the previous price
    const currentPrice = this.main.data.close[i];
    // const previousPrice = this.main.data.close[i - 1];

    // If the difference is a positive number, do something (buy?)
    if (smaDifference > this.config.buyAt) {
      logger.info(`[SMA MOON 1] Closing SMA is up by ${smaDifference}`);
      if (this.main.portfolio.usd > 0) {
        this.main.trade(this.main.portfolio.usd, currentPrice, this.main.tradeTypes.BUY);
      }
    } else if (smaDifference < this.config.sellAt) { // If the difference is a negative number, do something (sell?)
      logger.info(`[SMA MOON 1] Closing SMA is down by ${smaDifference}`);
      if (this.main.portfolio.btc > 0) {
        this.main.trade(this.main.portfolio.btc, currentPrice, this.main.tradeTypes.SELL);
      }
    }

    // logger.info(`[SMA MOON 1] Price Previous: ${previousPrice}`);
    // logger.info(`[SMA MOON 1] Price Current:  ${currentPrice}`);

    // logger.info(`[SMA MOON 1] SMA Previous: ${previousSma}`);
    // logger.info(`[SMA MOON 1] SMA Current:  ${currentSma}`);
  }
};
