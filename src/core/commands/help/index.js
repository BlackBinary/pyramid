const logger = require('@lib/logger');

module.exports = () => {
  logger.info('Run CPTB with one of the following commands');
  logger.info('node index --import --granularity 300 --product btc-eur --datapoints 12000 --name btc-eur-gran-2000-data-12000');
  logger.info('node index --backtest --strategy supermoon --name btc-eur-gran-2000-data-12000');
  logger.info('node index --test --strategy supermoon');
  logger.info('node index --start --strategy supermoon');
};
