const logger = require('@lib/logger');

module.exports.init = (_this) => {
  // Set the main to the caller
  this.main = _this;
};

module.exports.update = (i) => {
  logger.info(`Received update for index ${i}`);
  console.log(this.main.data.high[i]);
};
