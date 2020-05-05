const logger = require('@lib/logger').scope('strategy loader');

module.exports = (strategy) => {
  logger.info(`Loading strategy ${strategy}`);
  // TODO: If someone has a better idea i'd love to hear it
  try {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    return require(`@strategies/${strategy}`);
  } catch (e) {
    logger.error('Please make sure the strategy you specified exists');
    logger.error(e);
    return false;
  }
};
