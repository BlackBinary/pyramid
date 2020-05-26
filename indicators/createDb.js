require('module-alias/register');
require('dotenv').config();

const indicators = require('.');

const prices = [25.40, 25.90, 26.50, 26.30, 27.90, 25.40, 25.90, 26.50, 26.30, 27.90];

(async () => {
  const MACD = new indicators.MACD(4, 6, 5);

  prices.forEach((price) => {
    const smaRes = MACD.update(price);

    console.log(smaRes);
  });


  // console.log(indicators);

  // const ic = new indicators.EMA();
  // console.log(ic.config);

  // console.log(indicatorFiles);
})();
