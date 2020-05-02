const tulind = require('tulind');

const logger = require('@lib/logger');
const { client: dbClient } = require('@lib/database');

module.exports.getMarketData = async () => {
  const query = `
  SELECT DISTINCT
    time,
    product,
    -- low,
    -- high,
    -- open,
    close
    -- volume
  FROM candles
  ORDER BY time;
  `;

  return new Promise((resolve, reject) => {
    dbClient.all(query, [], (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
};

module.exports.data = {
  high: [],
  low: [],
  open: [],
  close: [],
  volume: [],
};

module.exports = async () => {
  logger.info('Backtesting');

  const data = await this.getMarketData();

  // Create new arrays with data
  data.forEach(({
    // high,
    // low,
    // open,
    close,
    // volume,
  }) => {
    // this.data.high.push(high);
    // this.data.low.push(low);
    // this.data.open.push(open);
    this.data.close.push(close);
    // this.data.volume.push(volume);
  });

  // Average over set periods
  const averageOver = 5;

  // First try with SMA over 5 periods
  tulind.indicators.sma.indicator([this.data.close], [averageOver], (err, results) => {
    // Get the results
    const [closingSma] = results;

    // For each result (price starts at the averageOver size, and should be smaller than the total length of prices + 1)
    for (let i = averageOver; i < (this.data.close.length - averageOver + 1); i += 1) {
      // Get the current and the previous result
      const currentSma = closingSma[i];
      const previousSma = closingSma[i - 1];

      // Get the current and the previous price
      const currentPrice = this.data.close[i];
      const previousPrice = this.data.close[i - 1];

      // Get the difference between
      const smaDifference = currentSma - previousSma;

      // If the difference is a positive number, do something (buy?)
      if (smaDifference > 0) {
        logger.info(`Closing SMA is up ${smaDifference}`);
      } else if (smaDifference < 0) { // If the difference is a negative number, do something (sell?)
        logger.info(`Closing SMA is down ${smaDifference}`);
      } else {
        logger.info('Closing SMA is equal');
      }

      logger.info(`Price Previous: ${previousPrice}`);
      logger.info(`Price Current:  ${currentPrice}`);

      logger.info(`SMA Previous: ${previousSma}`);
      logger.info(`SMA Current:  ${currentSma}`);
    }
  });
};
