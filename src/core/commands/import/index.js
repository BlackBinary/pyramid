const moment = require('moment');
const logger = require('@lib/logger');
const candles = require('@lib/coinbase/endpoints/products/candles');
// const products = require('@lib/coinbase/endpoints/products');

module.exports.isoFormat = 'YYYY-MM-DDThh:mm';

module.exports.generateDates = (start, granularity) => ({
  startDate: moment(start).format(this.isoFormat),
  endDate: moment(start).subtract(granularity * 300, 'seconds').format(this.isoFormat),
});

module.exports = async () => {
  const granularity = 300;
  const totalDatapoints = 300000;
  const product = 'BTC-EUR';

  logger.info('Importing data from Coinbase');
  logger.info(`Product: ${product}`);
  logger.info(`Granularity: ${granularity} seconds`);
  logger.info(`Total datapoints: ${totalDatapoints}`);
  logger.info(`Total requests: ${totalDatapoints / 300}`);

  const yesterday = moment(new Date()).subtract(1, 'day');

  let dates = {};
  for (let i = 0; i < totalDatapoints; i += 300) {
    if (i === 0) {
      dates = this.generateDates(yesterday, granularity);
    } else {
      dates = this.generateDates(dates.endDate, granularity);
    }
    const data = await candles.get(product, dates.endDate, dates.startDate, granularity);
    logger.info(data);
  }
};
