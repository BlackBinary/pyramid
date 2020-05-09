/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
const logger = require('@lib/logger');

class Loader {
  constructor() {
    this.Strategy = () => {};
  }

  load(strategy) {
    logger.info(`Loading strategy ${strategy}`);
    try {
      this.Strategy = require(`@strategies/${strategy}`);
    } catch (e) {
      logger.error('Please make sure the strategy you specified exists');
      logger.error(e);
    }
  }
}

module.exports = Loader;
