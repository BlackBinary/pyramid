const moment = require('moment');
const logger = require('@lib/logger');
const candles = require('@lib/coinbase/endpoints/products/candles');
const Bottleneck = require('bottleneck');
const { client: dbClient } = require('@lib/database');

// const products = require('@lib/coinbase/endpoints/products');

module.exports.isoFormat = 'YYYY-MM-DDThh:mm';

module.exports.generateDates = (start, granularity) => ({
  startDate: moment(start).format(this.isoFormat),
  endDate: moment(start).subtract(granularity * 300, 'seconds').format(this.isoFormat),
});

module.exports.checkOrCreateTable = () => {
  const query = `
    CREATE TABLE IF NOT EXISTS candles
    (
      product TEXT,
      time INTEGER,
      low INTEGER,
      high INTEGER,
      open INTEGER,
      close INTEGER,
      volume INTEGER
    );
  `;

  dbClient.run(query);
};

const limiter = new Bottleneck({
  maxConcurrent: 3,
  minTime: 666,
});

module.exports.fetchCandlesAndSave = async (product, start, end, granularity) => {
  limiter.schedule(() => candles.get(product, start, end, granularity))
    .then((result) => {
      logger.info(`Received result for timestamp ${result[0][0]}`);
      const dbJobs = result.map((candle) => dbClient.run(`
          INSERT INTO candles
          (product, time, low, high, open, close, volume)
          VALUES
          (?, ?, ?, ?, ?, ?, ?)
        `, [product, ...candle]));
      logger.info(`Result for timestamp ${result[0][0]} saved to database`);
      return Promise.all(dbJobs);
    });
};

module.exports = async () => {
  // Check if the candles table exists
  this.checkOrCreateTable();

  const granularity = 300;
  const totalDatapoints = 600000;
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
    this.fetchCandlesAndSave(product, dates.endDate, dates.startDate, granularity);
  }
};
