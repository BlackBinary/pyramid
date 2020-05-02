const tulind = require('tulind');

const logger = require('@lib/logger');
const { client: dbClient } = require('@lib/database');

module.exports.getMarketData = async () => {
  const query = `
  SELECT DISTINCT
    time,
    product,
    -- low,
    -- high,
    -- open,
    close
    -- volume
  FROM candles
  ORDER BY time;
  `;

  return new Promise((resolve, reject) => {
    dbClient.all(query, [], (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
};

module.exports.data = {
  // high: [],
  // low: [],
  // open: [],
  close: [],
  // volume: [],
};

module.exports.portfolio = {
  usd: 0,
  btc: 0,
};

module.exports.SELL = 'SELL';
module.exports.BUY = 'BUY';

module.exports.trades = [];

module.exports.trade = (amount, price, type) => {
  if (type === this.BUY) {
    logger.info(`[BACKTESTING] Buying ${amount} at ${price}`);
    this.portfolio.usd -= amount * price;
    this.portfolio.btc = amount;
    this.trades.push({ type: this.BUY, price, amount });
  } else if (type === this.SELL) {
    logger.info(`[BACKTESTING] Selling ${amount} at ${price}`);
    this.portfolio.usd += amount * price;
    this.portfolio.btc -= amount;
    this.trades.push({ type: this.SELL, price, amount });
  } else {
    logger.info('[BACKTESTING] Invalid trade type');
  }
};

module.exports = async () => {
  logger.info('Backtesting');

  const data = await this.getMarketData();

  // Create new arrays with data
  data.forEach(({
    // high,
    // low,
    // open,
    close,
    // volume,
  }) => {
    // this.data.high.push(high);
    // this.data.low.push(low);
    // this.data.open.push(open);
    this.data.close.push(close);
    // this.data.volume.push(volume);
  });

  // Average over set periods
  const averageOver = 5;

  // Set an initial portfolio to start trading with
  this.portfolio.usd = 100;
  const startedWith = { ...this.portfolio };

  // First try with SMA over 5 periods
  tulind.indicators.sma.indicator([this.data.close], [averageOver], (err, results) => {
    // Get the results
    const [closingSma] = results;

    // For each result (price starts at the averageOver size, and should be smaller than the total length of prices + 1)
    for (let i = averageOver; i < (this.data.close.length - averageOver + 1); i += 1) {
      // Get the current and the previous result
      const currentSma = closingSma[i];
      const previousSma = closingSma[i - 1];

      // Get the current and the previous price
      const currentPrice = this.data.close[i];
      const previousPrice = this.data.close[i - 1];

      // Get the difference between
      const smaDifference = currentSma - previousSma;

      // If the difference is a positive number, do something (buy?)
      if (smaDifference > 0) {
        logger.info(`[BACKTESTING] Closing SMA is up ${smaDifference}`);
        if (this.portfolio.usd > 0) {
          const amount = this.portfolio.usd / currentPrice;
          this.trade(amount, currentPrice, this.BUY);
        }
      } else if (smaDifference < 0) { // If the difference is a negative number, do something (sell?)
        logger.info(`[BACKTESTING] Closing SMA is down ${smaDifference}`);
        if (this.portfolio.btc > 0) {
          this.trade(this.portfolio.btc, currentPrice, this.SELL);
        }
      } else {
        logger.info('[BACKTESTING] Closing SMA is equal');
      }

      logger.info(`[BACKTESTING] Price Previous: ${previousPrice}`);
      logger.info(`[BACKTESTING] Price Current:  ${currentPrice}`);

      logger.info(`[BACKTESTING] SMA Previous: ${previousSma}`);
      logger.info(`[BACKTESTING] SMA Current:  ${currentSma}`);
    }

    logger.info('\n\n\n\n');
    logger.info('[BACKTESTING] Results');
    logger.info(`[BACKTESTING] Total trades done: ${this.trades.length}`);

    logger.info('[BACKTESTING] Started With:');
    logger.info(`[BACKTESTING] USD: ${startedWith.usd}`);
    logger.info(`[BACKTESTING] BTC: ${startedWith.btc}`);

    logger.info('[BACKTESTING] Ended With:');
    logger.info(`[BACKTESTING] USD: ${this.portfolio.usd}`);
    logger.info(`[BACKTESTING] BTC: ${this.portfolio.btc}`);

    const totalProfits = this.portfolio.usd + (this.portfolio.btc * this.data.close[this.data.close.length - 1]);
    logger.info('[BACKTESTING] Potential profits:');
    logger.info(`[BACKTESTING] USD: ${totalProfits}`);
  });
};
