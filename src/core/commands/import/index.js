const moment = require('moment');
const Bottleneck = require('bottleneck');

const logger = require('@lib/logger');
const candles = require('@lib/coinbase/endpoints/products/candles');
const { client: dbClient } = require('@lib/database');

// const products = require('@lib/coinbase/endpoints/products');

module.exports.isoFormat = 'YYYY-MM-DDTHH:mm';

module.exports.maxDataPointsPerRequest = 300;

module.exports.generateDates = (start, granularity) => ({
  startDate: moment(start).format(this.isoFormat),
  endDate: moment(start).subtract(this.maxDataPointsPerRequest * granularity, 'seconds').format(this.isoFormat),
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
  reservoir: 30, // initial value
  reservoirIncreaseMaximum: 30,
  reservoirRefreshAmount: 100,
  reservoirRefreshInterval: 30 * 1000, // must be divisible by 250

  // also use maxConcurrent and/or minTime for safety
  maxConcurrent: 1,
  minTime: 1000,
});

module.exports.addRanges = (ranges, product, granularity) => {
  ranges.forEach(({ endDate, startDate }) => limiter.schedule(() => {
    logger.info(`[IMPORT] Current job count: ${limiter.counts().QUEUED}`);
    logger.info(`[IMPORT] Added range ${endDate} - ${startDate}`);

    return this.fetchCandlesAndSave(product, endDate, startDate, granularity);
  }));
};

module.exports.fetchCandlesAndSave = (product, start, end, granularity) => {
  candles.get(product, start, end, granularity)
    .then(({ data }) => {
      logger.info('[IMPORT] New data received');
      const prepared = dbClient.prepare(`
        INSERT INTO candles
        (product, time, low, high, open, close, volume)
        VALUES
        (?, ?, ?, ?, ?, ?, ?)
      `);

      const dbJobs = data.map((candle) => prepared.run([product, ...candle]));

      return Promise.all(dbJobs).finally(() => {
        logger.info('[IMPORT] New data saved to database');
      });
    })
    .catch((error) => {
      logger.info('[IMPORT] Importing data failed');
      if (error.response) {
        if (error.response.status === 400) {
          const divideBy = 2;
          logger.info(`[IMPORT] Granularity too large for start and end date. Divide by ${divideBy}`);
          const ranges = [];
          let dates = {};
          for (let i = 0; i < divideBy; i += 1) {
            const newGranularity = (granularity * this.maxDataPointsPerRequest) / divideBy;
            const dateToAdd = i === 0 ? start : dates.endDate;
            dates = this.generateDates(dateToAdd, newGranularity);
            ranges.push(dates);
          }
          this.addRanges(ranges, product, granularity);
        }
      } else {
        limiter.schedule(() => this.fetchCandlesAndSave(product, end, start, granularity));
      }
    });
};

module.exports = () => {
  // Check if the candles table exists
  this.checkOrCreateTable();

  const granularity = 60;
  const totalDatapoints = 20000;
  const product = 'BTC-EUR';

  logger.info('Importing data from Coinbase');
  logger.info(`Product: ${product}`);
  logger.info(`Granularity: ${granularity} seconds`);
  logger.info(`Total datapoints: ${totalDatapoints}`);
  logger.info(`Total requests: ${totalDatapoints / granularity}`);

  const ranges = [];
  let dates = {};
  for (let i = 0; i < totalDatapoints; i += granularity) {
    const dateToAdd = i === 0 ? moment(new Date()).subtract(1, 'day') : dates.endDate;
    dates = this.generateDates(dateToAdd, granularity);
    ranges.push(dates);
  }

  this.addRanges(ranges, product, granularity);
};
