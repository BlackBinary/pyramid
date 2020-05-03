const moment = require('moment');

const logger = require('@lib/logger');
const { client: dbClient } = require('@lib/database');

module.exports.getMarketData = async () => {
  const query = `
  SELECT DISTINCT
    time,
    product,
    low,
    high,
    open,
    close,
    volume
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
  high: [],
  low: [],
  open: [],
  close: [],
  volume: [],
  time: [],
};

module.exports.portfolio = {
  usd: 0,
  btc: 0,
};

module.exports.tradeTypes = {
  SELL: 'SELL',
  BUY: 'BUY',
};

module.exports.loadStrategy = (strategy) => {
  // TODO: If someone has a better idea i'd love to hear it
  // eslint-disable-next-line global-require, import/no-dynamic-require
  this.strategy = require(`@strategies/${strategy}`);
  this.portfolio = { ...this.portfolio, ...this.strategy.config.backtesting.portfolio };
};

module.exports.fees = 0.5 / 100;

module.exports.trades = [];

module.exports.trade = (amount, price, type, time) => {
  if (type === this.tradeTypes.BUY) {
    const fee = amount * this.fees;
    const buyingTotal = ((amount - fee) / price); // Total bitcoin
    // Remove the total of usd used to buy
    this.portfolio.usd -= amount;
    // Add the amount of btc bought minus the fee
    this.portfolio.btc += buyingTotal;
    // Add the trade to the list of trades
    this.trades.push({
      type: this.tradeTypes.BUY,
      total: buyingTotal,
      price,
      amount,
      fee,
      time,
    });
    logger.info(`[BACKTESTING] Buying ${buyingTotal} at ${price}`);
  } else if (type === this.tradeTypes.SELL) {
    const fee = amount * this.fees;
    const sellingTotal = ((amount - fee) * price); // Total usd
    // Add the amount usd profit minus the fee
    this.portfolio.usd += sellingTotal - fee;
    // Remove the amount btc sold
    this.portfolio.btc -= amount;
    // Add the trade to the list of trades
    this.trades.push({
      type: this.tradeTypes.SELL,
      total: sellingTotal,
      price,
      amount,
      fee,
      time,
    });
    logger.info(`[BACKTESTING] Selling ${amount} at ${price}`);
  }
};

module.exports = async (strategy) => {
  logger.info('[BACKTESTING] Starting backtesting');

  this.loadStrategy(strategy);

  const marketData = await this.getMarketData();

  // Create new arrays with data
  marketData.forEach(({
    high,
    low,
    open,
    close,
    volume,
    time,
  }) => {
    this.data.high.push(high);
    this.data.low.push(low);
    this.data.open.push(open);
    this.data.close.push(close);
    this.data.volume.push(volume);
    this.data.time.push(time);
  });

  // Copy the initial portfolio for comparison
  const startedWith = { ...this.portfolio };

  // Call the strategy init function
  if (this.strategy.init) {
    this.strategy.init(this);
  } else {
    logger.error('[BACKTESTING] Could not init strategy');
  }

  for (let i = 0; i < marketData.length; i += 1) {
    this.strategy.update(i);
  }

  const startTime = moment.unix(this.data.time[0]).format();
  const endtTime = moment.unix(this.data.time[this.data.time.length - 1]).format();

  logger.info('\n\n\n\n');

  logger.info('[BACKTESTING] Results');
  logger.info(`[BACKTESTING] Total trades done: ${this.trades.length}`);
  logger.info(`[BACKTESTING] Trades done between ${startTime} and ${endtTime}`);

  logger.info('[BACKTESTING] Started With:');
  logger.info(`[BACKTESTING] USD: ${startedWith.usd}`);
  logger.info(`[BACKTESTING] BTC: ${startedWith.btc}`);

  logger.info('[BACKTESTING] Ended With:');
  logger.info(`[BACKTESTING] USD: ${this.portfolio.usd}`);
  logger.info(`[BACKTESTING] BTC: ${this.portfolio.btc}`);

  const totalProfits = this.portfolio.usd + (this.portfolio.btc * this.data.close[this.data.close.length - 1]);

  logger.info('[BACKTESTING] Potential profits:');
  logger.info(`[BACKTESTING] USD: ${totalProfits}`);
};
