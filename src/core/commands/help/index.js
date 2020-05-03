const logger = require('@lib/logger');

module.exports = () => {
  logger.info('Run CPTB with one of the following commands');
  logger.info('node index --backtest --strategy [strategy name]');
  logger.info('node index --import');
  logger.info('node index --start');
};
