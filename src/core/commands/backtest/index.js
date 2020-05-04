const moment = require('moment');

const logger = require('@lib/logger');
const { client: dbClient } = require('@lib/database');

module.exports.getMarketData = async (importName) => {
  const query = `
  SELECT
    timestamp,
    product,
    low,
    high,
    open,
    close,
    volume
  FROM candles
  WHERE importId = (
    SELECT id
    FROM imports
    WHERE name = ?
  )
  GROUP BY timestamp, product
  ORDER BY timestamp;
  `;

  return new Promise((resolve, reject) => {
    dbClient.all(query, [importName], (err, data) => {
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
  timestamp: [],
};

module.exports.portfolio = {
  fiat: 0,
  crypto: 0,
};

module.exports.tradeTypes = {
  SELL: 'SELL',
  BUY: 'BUY',
};

module.exports.loadStrategy = (strategy) => {
  // TODO: If someone has a better idea i'd love to hear it
  try {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    this.strategy = require(`@strategies/${strategy}`);
    this.portfolio = { ...this.portfolio, ...this.strategy.config.backtesting.portfolio };
  } catch (e) {
    logger.error('[BACKTESTING] Please make sure the strategy you specified exists');
    logger.error(e);
    this.strategy = {};
  }
};

module.exports.fees = 0.5 / 100;

module.exports.trades = [];

module.exports.trade = (amount, price, type, timestamp) => {
  if (type === this.tradeTypes.BUY) {
    const fee = amount * this.fees;
    const buyingTotal = ((amount - fee) / price); // Total bitcoin
    // Remove the total of fiat used to buy
    this.portfolio.fiat -= amount;
    // Add the amount of crypto bought minus the fee
    this.portfolio.crypto += buyingTotal;
    // Add the trade to the list of trades
    this.trades.push({
      type: this.tradeTypes.BUY,
      total: buyingTotal,
      price,
      amount,
      fee,
      timestamp,
    });
    logger.info(`[BACKTESTING] Buying ${buyingTotal} at ${price}`);
  } else if (type === this.tradeTypes.SELL) {
    const fee = amount * this.fees;
    const sellingTotal = ((amount - fee) * price); // Total fiat
    // Add the amount fiat profit minus the fee
    this.portfolio.fiat += sellingTotal - fee;
    // Remove the amount crypto sold
    this.portfolio.crypto -= amount;
    // Add the trade to the list of trades
    this.trades.push({
      type: this.tradeTypes.SELL,
      total: sellingTotal,
      price,
      amount,
      fee,
      timestamp,
    });
    logger.info(`[BACKTESTING] Selling ${amount} at ${price}`);
  }
};

module.exports = async (args) => {
  logger.info('[BACKTESTING] Starting backtesting');

  const importName = () => {
    if (args.import) {
      const type = typeof args.import;
      if (type === 'string') {
        return args.import;
      }
      logger.error(`[BACKTESTING] Name must be of type string. ${type} given`);
      return false;
    }
    return false;
  };

  if (!importName()) {
    logger.error('[BACKTESTING] No import specified');
    logger.error('[BACKTESTING] Please provide the name of the import you want to run against');
    logger.error('[BACKTESTING] --import btc-eur-gran-300-data-12000');
    return;
  }

  const strategy = () => {
    if (args.strategy) {
      return args.strategy;
    }
    return false;
  };

  if (!strategy()) {
    logger.error('[BACKTESTING] No strategy specified');
    logger.error('[BACKTESTING] Please provide the name of the import you want to run against');
    logger.error('[BACKTESTING] --strategy supermoon');
    return;
  }

  this.loadStrategy(strategy());

  const marketData = await this.getMarketData(importName());

  if (!marketData.length) {
    logger.error('[BACKTESTING] No market data to run against. Did you specify the correct import?');
    return;
  }

  // Create new arrays with data
  marketData.forEach(({
    high,
    low,
    open,
    close,
    volume,
    timestamp,
  }) => {
    this.data.high.push(high);
    this.data.low.push(low);
    this.data.open.push(open);
    this.data.close.push(close);
    this.data.volume.push(volume);
    this.data.timestamp.push(timestamp);
  });

  // Copy the initial portfolio for comparison
  const startedWith = { ...this.portfolio };

  // Call the strategy init function
  if (this.strategy.init) {
    this.strategy.init(this);
  } else {
    logger.error('[BACKTESTING] Could not init strategy');
    logger.error('[BACKTESTING] Please make sure the strategy has all the required functions');
    return;
  }

  for (let i = 0; i < marketData.length; i += 1) {
    this.strategy.update(i);
  }

  const startTime = moment.unix(this.data.timestamp[0]).format();
  const endtTime = moment.unix(this.data.timestamp[this.data.timestamp.length - 1]).format();

  logger.info('\n\n\n\n');

  logger.info('[BACKTESTING] Results');
  logger.info(`[BACKTESTING] Total trades done: ${this.trades.length}`);
  logger.info(`[BACKTESTING] Trades done between ${startTime} and ${endtTime}`);

  logger.info('[BACKTESTING] Started With:');
  logger.info(`[BACKTESTING] Fiat:   ${startedWith.fiat}`);
  logger.info(`[BACKTESTING] Crypto: ${startedWith.crypto}`);

  logger.info('[BACKTESTING] Ended With:');
  logger.info(`[BACKTESTING] Fiat:   ${this.portfolio.fiat}`);
  logger.info(`[BACKTESTING] Crypto: ${this.portfolio.crypto}`);

  const totalProfits = this.portfolio.fiat + (this.portfolio.crypto * this.data.close[this.data.close.length - 1]);

  logger.info('[BACKTESTING] Potential outcome:');
  logger.info(`[BACKTESTING] Total fiat:  ${totalProfits}`);
  logger.info(`[BACKTESTING] Profit fiat: ${totalProfits - startedWith.fiat}`);

  // Display a fair warning
  logger.warn('[BACKTESTING] By no means is backtesting usefull for making guarantees about the strategies you test.');
  logger.warn('[BACKTESTING] Keep in mind that there may be false positives and negatives in the data you test against.');
  logger.warn('[BACKTESTING] Please always take caution and know you and only you are responsible for the financial mistakes you make.');
};
