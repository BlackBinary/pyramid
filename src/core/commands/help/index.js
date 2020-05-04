const logger = require('@lib/logger');

module.exports = () => {
  logger.info('[HELP] Run CPTB with one of the following commands');
  logger.info('[HELP] node index --listimports');
  logger.info('[HELP] node index --import --granularity 300 --product btc-eur --datapoints 12000 --name btc-eur-gran-300-data-12000');
  logger.info('[HELP] node index --backtest --strategy supermoon --import btc-eur-gran-2000-data-12000');
  logger.info('[HELP] node index --test --strategy supermoon');
  // logger.info('[HELP] node index --start --strategy supermoon');
};
