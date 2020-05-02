const tulind = require('tulind');

const logger = require('@lib/logger');
const { client: dbClient } = require('@lib/database');

module.exports.getMarketData = async () => {
  const query = `
  SELECT DISTINCT
  time, product, low, high, open, close, volume
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

  data.forEach(({
    high, low, open, close, volume,
  }) => {
    this.data.high.push(high);
    this.data.low.push(low);
    this.data.open.push(open);
    this.data.close.push(close);
    this.data.volume.push(volume);
  });

  tulind.indicators.macd.indicator([this.data.close], [12, 26, 9], (err, results) => {
    console.log('Result of macd is:');
    const [macd, signal, histogram] = results;

    for (let i = 0; i < macd.length; i++) {
      const currentMacd = macd[i];
      const currentSignal = signal[i];
      const previousMacd = macd[i - 1];
      const previousSignal = signal[i - 1];


      const up = currentMacd - previousMacd > previousMacd;

      console.log(`Is market up? ${up}`);
      // console.log(currentMacd - previousMacd);
      // console.log(`macd:   ${currentMacd}`);
      // console.log(`signal: ${currentSignal}`);
    }
    // console.log(macd);
    // console.log(signal);
    // console.log(histogram);
  });
};
