const moment = require('moment');

const logger = require('@root/server/src/lib/logger')(false);
// const { client: sqlite } = require('@root/server/src/lib/database/sqlite');
const StrategyLoader = require('@root/server/src/lib/strategy/loader');

module.exports.strategy = () => {};

// module.exports.getMarketData = async (importName) => {
//   const query = `
//   SELECT
//     timestamp,
//     product,
//     low,
//     high,
//     open,
//     close,
//     volume
//   FROM candles
//   WHERE importId = (
//     SELECT id
//     FROM imports
//     WHERE name = ?
//   )
//   GROUP BY timestamp, product
//   ORDER BY timestamp;
//   `;

//   return new Promise((resolve, reject) => {
//     sqlite.all(query, [importName], (err, data) => {
//       if (err) reject(err);
//       else resolve(data);
//     });
//   });
// };

module.exports = async ({ strategy, importName }) => {
  logger.info('Start backtesting');

  const Loader = new StrategyLoader();

  Loader.load(strategy);

  this.strategy = new Loader.Strategy(true);

  const marketData = await this.getMarketData(importName);

  if (!marketData.length) {
    logger.error('No market data to run against. Did you specify the correct import?');
  }

  // Make sure the strategy is valid
  if (this.strategy.init) {
    logger.info('Init strategy');
    // Call the strategy init function
    this.strategy.init();
  } else {
    logger.error('Could not init strategy');
    logger.error('Please make sure the strategy exists and has all the required functions');
  }

  const startedWith = { ...this.strategy.Trader.portfolio };

  logger.info('Done setting data');

  for (let i = 0; i < marketData.length; i += 1) {
    // Update the strategy with one candle
    this.strategy.update(marketData[i]);
  }

  const startTime = moment.unix(marketData[0].timestamp).format();
  const endTime = moment.unix(marketData[marketData.length - 1].timestamp).format();

  logger.info('-----------------------------------------------------------------------------');

  logger.info('Results');
  logger.info(`Total trades done: ${this.strategy.Trader.trades.length}`);
  logger.info(`Trades done between ${startTime} and ${endTime}`);

  // TODO: Do some info about pos and neg trades
  // this.strategy.Trader.trades.forEach((trade) => {
  //   console.log(trade);
  // });

  logger.info('Started With:');
  logger.info(`Fiat:   ${startedWith.fiat}`);
  logger.info(`Crypto: ${startedWith.crypto}`);

  logger.info('Ended With:');
  logger.info(`Fiat:   ${this.strategy.Trader.portfolio.fiat}`);
  logger.info(`Crypto: ${this.strategy.Trader.portfolio.crypto}`);

  const totalProfits = this.strategy.Trader.portfolio.fiat + (
    this.strategy.Trader.portfolio.crypto * marketData[marketData.length - 1].close
  );

  logger.info('Potential outcome:');
  logger.info(`Total fiat:  ${totalProfits}`);
  logger.info(`Profit fiat: ${totalProfits - startedWith.fiat}`);

  // Display a warning
  logger.warn('By no means is backtesting usefull for making guarantees about the strategies you test.');
  logger.warn('Keep in mind that there may be false positives and negatives in the data you test against.');
  logger.warn('Please always take caution and know you and only you are responsible for the financial mistakes you make.');

  logger.info('Done. Exit.');
};
