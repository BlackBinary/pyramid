const moment = require('moment');
const Bottleneck = require('bottleneck');

const logger = require('@lib/logger').scope('import');
const candles = require('@lib/coinbase/endpoints/products/candles');
const { client: sqlite } = require('@lib/database/sqlite');

module.exports.isoFormat = 'YYYY-MM-DDTHH:mm';

module.exports.maxDataPointsPerRequest = 300;

module.exports.availableGranularity = [60, 300, 900, 3600, 21600, 86400];

module.exports.generateDates = (start, granularity) => ({
  startDate: moment(start).format(this.isoFormat),
  endDate: moment(start).subtract(this.maxDataPointsPerRequest * granularity, 'seconds').format(this.isoFormat),
});

module.exports.checkOrCreateTables = () => {
  const createImportsQuery = `
    CREATE TABLE IF NOT EXISTS imports
    (
      id INTEGER PRIMARY KEY,
      name TEXT UNIQUE,
      product TEXT,
      datapoints INTEGER,
      granularity INTEGER,
      timestamp INTEGER
    );
  `;
  const createCandlesQuery = `
    CREATE TABLE IF NOT EXISTS candles
    (
      id INTEGER PRIMARY KEY,
      importId INTEGER NOT NULL,
      product TEXT,
      timestamp INTEGER,
      low INTEGER,
      high INTEGER,
      open INTEGER,
      close INTEGER,
      volume INTEGER
    );
  `;

  return Promise.all([
    new Promise((resolve, reject) => {
      sqlite.run(createImportsQuery, (err) => {
        if (err) return reject();
        return resolve();
      });
    }),
    new Promise((resolve, reject) => {
      sqlite.run(createCandlesQuery, (err) => {
        if (err) return reject();
        return resolve();
      });
    }),
  ]);
};

module.exports.addRanges = (ranges, product, granularity, importId) => {
  ranges.forEach(({ endDate, startDate }) => this.limiter.schedule(() => {
    logger.info(`Current job count: ${this.limiter.counts().QUEUED}`);
    logger.info(`Added range ${endDate} - ${startDate}`);

    return this.fetchCandlesAndimportName(product, endDate, startDate, granularity, importId);
  }));
};

module.exports.fetchCandlesAndimportName = (product, start, end, granularity, importId) => {
  candles.get(product, start, end, granularity)
    .then(({ data }) => {
      logger.info('New data received');
      const prepared = sqlite.prepare(`
        INSERT INTO candles
        (importId, product, timestamp, low, high, open, close, volume)
        VALUES
        (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const dbJobs = data.map(async (candle) => prepared.run([importId, product, ...candle]));

      return Promise.all(dbJobs).finally(() => {
        logger.info('New data importNamed to database');
      });
    })
    .catch((error) => {
      logger.info('Importing data failed');
      if (error.response) {
        if (error.response.status === 400) {
          const divideBy = 2;
          logger.info(`Granularity too large for start and end date. Divide by ${divideBy}`);
          const ranges = [];
          let dates = {};
          for (let i = 0; i < divideBy; i += 1) {
            const dateToAdd = i === 0 ? start : dates.endDate;
            dates = this.generateDates(dateToAdd, granularity / divideBy);
            ranges.push(dates);
          }
          this.addRanges(ranges, product, granularity, importId);
        } else if (error.response.status === 404) {
          logger.error('Couldn\'t be found. Please make sure you add an available product');
          throw new Error(error.response.data);
        }
      } else {
        this.limiter.schedule(() => this.fetchCandlesAndimportName(product, end, start, granularity));
      }
    });
};

module.exports.createImport = (name, product, datapoints, granularity, timestamp) => {
  const query = `
  INSERT INTO imports
  (name, product, datapoints, granularity, timestamp)
  VALUES
  (?, ?, ?, ?, ?);
  `;
  return new Promise((resolve, reject) => {
    sqlite.run(query, [name, product, datapoints, granularity, timestamp], function returnId(error) {
      if (error) return reject(error);
      return resolve(this.lastID);
    });
  });
};

module.exports = async ({
  importName,
  product,
  datapoints,
  granularity,
}) => {
  // Check if granularity is available
  if (!this.availableGranularity.includes(granularity)) {
    logger.error(`Granularity must be one of ${this.availableGranularity.join(', ')}`);

    return false;
  }

  logger.info('Starting import');

  // Check if the candles table exists
  await this.checkOrCreateTables();

  const now = moment().unix();

  this.limiter = new Bottleneck({
    reservoir: 30, // initial value
    reservoirIncreaseMaximum: 30,
    reservoirRefreshAmount: 100,

    // also use maxConcurrent and/or minTime for safety
    maxConcurrent: 1,
    minTime: 1000,
  });

  this.createImport(importName, product, datapoints, granularity, now)
    .then((importId) => {
      logger.info('Importing data from Coinbase');
      logger.info(`Import name: ${importName}`);
      logger.info(`Import id: ${importId}`);
      logger.info(`Product: ${product}`);
      logger.info(`Granularity: ${granularity} seconds`);
      logger.info(`Total datapoints: ${datapoints}`);
      logger.info(`Total requests: ${datapoints / this.maxDataPointsPerRequest}`);

      const ranges = [];
      let dates = {};
      for (let i = 0; i < datapoints; i += this.maxDataPointsPerRequest) {
        const dateToAdd = i === 0 ? moment().subtract(1, 'day') : dates.endDate;
        dates = this.generateDates(dateToAdd, granularity);
        ranges.push(dates);
      }

      this.addRanges(ranges, product, granularity, importId);
    })
    .catch((error) => {
      logger.error('Import could not be done. Import name probably already exists.');
      logger.error(error);
    });
};
