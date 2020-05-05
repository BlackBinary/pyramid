const moment = require('moment');

const logger = require('@lib/logger').scope('backtest');
const { client: sqlite } = require('@lib/database/sqlite');
const strategyLoader = require('@lib/helpers/strategy/loader');

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
    sqlite.all(query, [importName], (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
};

module.exports.portfolio = {
  fiat: 0,
  crypto: 0,
};

module.exports.tradeTypes = {
  SELL: 'SELL',
  BUY: 'BUY',
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
    logger.info(`Buying ${buyingTotal} at ${price}`);
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
    logger.info(`Selling ${amount} at ${price}`);
  }
};

module.exports = async (args) => {
  logger.info('Starting backtesting');

  const importName = () => {
    if (args.import) {
      const type = typeof args.import;
      if (type === 'string') {
        return args.import;
      }
      logger.error(`Name must be of type string. ${type} given`);
      return false;
    }
    return false;
  };

  if (!importName()) {
    logger.error('No import specified');
    logger.error('Please provide the name of the import you want to run against');
    logger.error('--import btc-eur-gran-300-data-12000');
    return;
  }

  const strategy = () => {
    if (args.strategy) {
      const type = typeof args.strategy;
      if (type === 'string') {
        return args.strategy;
      }
      return false;
    }
    return false;
  };

  if (!strategy()) {
    logger.error('No strategy specified');
    logger.error('Please provide the name of the import you want to run against');
    logger.error('--strategy supermoon');
    return;
  }

  this.strategy = strategyLoader(strategy());

  const marketData = await this.getMarketData(importName());

  if (!marketData.length) {
    logger.error('No market data to run against. Did you specify the correct import?');
    return;
  }

  if (this.strategy.config) {
    // Override the default settings with the backtesting settings from the strategy
    this.portfolio = {
      ...this.portfolio,
      ...this.strategy.config.backtesting.portfolio,
    };
  } else {
    logger.warn('Strategy does not have a config');
  }

  // Make sure the strategy is valid
  if (this.strategy.init) {
    this.currentTimestamp = moment().unix();
    this.strategy.timestamp = this.currentTimestamp;

    // Call the strategy init function
    this.strategy.init(this);

    // Set function to get candle range
    this.strategy.getCandleRange = this.getCandleRange;
  } else {
    logger.error('Could not init strategy');
    logger.error('Please make sure the strategy exists and has all the required functions');
    return;
  }

  // Copy the initial portfolio for comparison
  const startedWith = {
    ...this.portfolio,
  };

  logger.info('Done setting data');

  for (let i = 0; i < marketData.length; i += 1) {
    const candle = marketData[i];
    this.strategy.update(candle);
  }

  const startTime = moment.unix(marketData[0].timestamp).format();
  const endTime = moment.unix(marketData[marketData.length - 1].timestamp).format();

  logger.info('\n\n\n\n');

  logger.info('Results');
  logger.info(`Total trades done: ${this.trades.length}`);
  logger.info(`Trades done between ${startTime} and ${endTime}`);

  logger.info('Started With:');
  logger.info(`Fiat:   ${startedWith.fiat}`);
  logger.info(`Crypto: ${startedWith.crypto}`);

  logger.info('Ended With:');
  logger.info(`Fiat:   ${this.portfolio.fiat}`);
  logger.info(`Crypto: ${this.portfolio.crypto}`);

  const totalProfits = this.portfolio.fiat + (this.portfolio.crypto * marketData[marketData.length - 1].close);

  logger.info('Potential outcome:');
  logger.info(`Total fiat:  ${totalProfits}`);
  logger.info(`Profit fiat: ${totalProfits - startedWith.fiat}`);

  // Display a fair warning
  logger.warn('By no means is backtesting usefull for making guarantees about the strategies you test.');
  logger.warn('Keep in mind that there may be false positives and negatives in the data you test against.');
  logger.warn('Please always take caution and know you and only you are responsible for the financial mistakes you make.');

  logger.info('Done. Exit.');
};
