const logger = require('@lib/logger');

module.exports.init = (_this) => {
  this.trade = _this.trade;
  this.data = _this.data;
  console.log(this);
};

module.exports.update = (i) => {
  logger.info(`Update ${i}`);
};
