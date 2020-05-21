const Binance = require('node-binance-api');

const {
  BINANCE_SECRET,
  BINANCE_KEY,
} = process.env;

module.exports = new Binance().options({
  APIKEY: BINANCE_KEY,
  APISECRET: BINANCE_SECRET,
});
