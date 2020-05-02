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

module.exports.fees = 0.5 / 100;

module.exports.trades = [];

module.exports.trade = (amount, price, type) => {
  if (type === this.BUY) {
    const fee = amount * this.fees;
    const buyingTotal = ((amount - fee) / price); // Total bitcoin
    // Remove the total of usd used to buy
    this.portfolio.usd -= amount;
    // Add the amount of btc bought minus the fee
    this.portfolio.btc += buyingTotal;
    // Add the trade to the list of trades
    this.trades.push({
      type: this.BUY,
      total: buyingTotal,
      price,
      amount,
      fee,
    });
    logger.info(`[BACKTESTING] Buying ${amount} at ${price}`);
  } else if (type === this.SELL) {
    const fee = amount * this.fees;
    const sellingTotal = ((amount - fee) * price); // Total usd
    // Add the amount usd profit minus the fee
    this.portfolio.usd += sellingTotal - fee;
    // Remove the amount btc sold
    this.portfolio.btc -= amount;
    // Add the trade to the list of trades
    this.trades.push({
      type: this.SELL,
      total: sellingTotal,
      price,
      amount,
      fee,
    });
    logger.info(`[BACKTESTING] Selling ${amount} at ${price}`);
  }
};

module.exports = async () => {
  logger.info('[BACKTESTING] Starting backtesting');

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
        // logger.info(`[BACKTESTING] Closing SMA is up ${smaDifference}`);
        if (this.portfolio.usd > 0) {
          this.trade(this.portfolio.usd, currentPrice, this.BUY);
        }
      } else if (smaDifference < 0) { // If the difference is a negative number, do something (sell?)
        // logger.info(`[BACKTESTING] Closing SMA is down ${smaDifference}`);
        if (this.portfolio.btc > 0) {
          this.trade(this.portfolio.btc, currentPrice, this.SELL);
        }
      } else {
        logger.info('[BACKTESTING] Closing SMA is equal');
      }

      // logger.info(`[BACKTESTING] Price Previous: ${previousPrice}`);
      // logger.info(`[BACKTESTING] Price Current:  ${currentPrice}`);

      // logger.info(`[BACKTESTING] SMA Previous: ${previousSma}`);
      // logger.info(`[BACKTESTING] SMA Current:  ${currentSma}`);
    }

    console.log(this.trades);

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
