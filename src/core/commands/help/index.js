const logger = require('@lib/logger').scope('help');

module.exports = () => {
  logger.info('Run CPTB with one of the following commands');
  logger.info('node cptb --listimports');
  logger.info('node cptb --import --granularity 300 --product btc-eur --datapoints 12000 --name btc-eur-gran-300-data-12000');
  logger.info('node cptb --backtest --strategy supermoon --import btc-eur-gran-2000-data-12000');
  logger.info('node cptb --test --strategy supermoon');
  // logger.info('node cptb --start --strategy supermoon');
};
