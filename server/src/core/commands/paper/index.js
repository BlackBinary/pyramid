const Pyramid = require('@root/server/src/core/pyramid');

const logger = require('@root/server/src/lib/logger')(true);
const StrategyLoader = require('@root/server/src/lib/strategy/loader');
// const binance = require('@lib/binance');

module.exports.strategy = () => {};
module.exports.bot = () => {};

module.exports.primeCandles = [];

module.exports = async ({ strategy, pairs }) => {
  logger.info('Starting backtesting');
  logger.warn('WITH PRIMING ENABLED ONLY ONE PAIR WILL WORK');
  logger.warn('WITH PRIMING ENABLED ONLY ONE PAIR WILL WORK');
  logger.warn('WITH PRIMING ENABLED ONLY ONE PAIR WILL WORK');
  logger.warn('WITH PRIMING ENABLED ONLY ONE PAIR WILL WORK');
  logger.warn('WITH PRIMING ENABLED ONLY ONE PAIR WILL WORK');
  logger.warn('WITH PRIMING ENABLED ONLY ONE PAIR WILL WORK');

  // Create a new strategy loader
  const Loader = new StrategyLoader();

  // Load the strategy
  Loader.load(strategy);

  // Create the new strategy
  this.strategy = new Loader.Strategy(true);

  // Create a new bot
  this.bot = new Pyramid(pairs);

  // Make sure the strategy is valid
  if (this.strategy.init) {
    logger.info('Init strategy');

    // // Check if we need to prime the strategy
    // if (this.strategy.config.prime) {
    //   this.primeCandles = (
    //      await candles.get(pairs[0], '', '', this.bot.tickerInterval / 1000)
    //   ).data;
    // }

    // Call the strategy init function
    this.strategy.init(this.primeCandles);
  } else {
    logger.error('Could not init strategy');
    logger.error('Please make sure the strategy exists and has all the required functions');
  }

  // Start the bot
  this.bot.start();

  // Wait for the bot to do tick
  this.bot.on('tick', (data) => {
    this.strategy.update(data);
  });
};
