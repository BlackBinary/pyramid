const logger = require('@lib/logger');

const bot = () => {
  logger.info('SSSSH! Bot is trading');
};

module.exports = (args, test = false) => {
  logger.info('[CPTB] Starting CPTB! Feel free to abort while you can.');
  if (test) {
    logger.info('[CPTB] Starting CPTB in test mode.');
  }
  logger.info('[CPTB] Let me tell you something. There’s no nobility in poverty. I’ve been a rich man and I’ve been a poor man. And I choose rich every f**king time. – Jordan Belfort.');
  setInterval(() => {
    bot();
  }, 1000);
};
