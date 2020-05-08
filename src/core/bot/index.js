const moment = require('moment');

const websocket = require('@lib/coinbase/websocket');
const logger = require('@lib/logger').scope('cptb');
const strategyLoader = require('@lib/helpers/strategy/loader');
const candles = require('@lib/coinbase/endpoints/products/candles');

// This is what an update looks like
// {
//   "type": "ticker",
//   "sequence": 7371474926,
//   "product_id": "BTC-EUR",
//   "price": "8187.18",
//   "open_24h": "8056.39000000",
//   "volume_24h": "3323.40512926",
//   "low_24h": "7815.00000000",
//   "high_24h": "8217.43000000",
//   "volume_30d": "87910.55139830",
//   "best_bid": "8180.09",
//   "best_ask": "8187.18",
//   "side": "buy",
//   "time": "2020-05-04T21:24:03.088931Z",
//   "trade_id": 26323815,
//   "last_size": "0.08679"
// }

module.exports.portfolio = {
  fiat: 0,
  crypto: 0,
};

module.exports.tradeTypes = {
  SELL: 'SELL',
  BUY: 'BUY',
};

module.exports.fees = 0.5 / 100;

module.exports.trades = [];

module.exports.tickerInterval = 1000 * 60 * 1;
module.exports.lastTime = Date.now();
module.exports.lastDelay = this.tickerInterval;

module.exports.ticker = () => {
  this.candle.timestamp = moment().unix();

  this.strategy.update(this.candle);

  const { close } = this.candle;

  // Set all the keys in candle to the close price
  Object.keys(this.candle).forEach((key) => this.candle[key] = close);

  const now = Date.now();
  const dTime = now - this.lastTime;

  this.lastTime = now;
  this.lastDelay = this.tickerInterval + this.lastDelay - dTime;

  setTimeout(this.ticker, this.lastDelay);
};

module.exports.candle = {
  high: null,
  low: null,
  close: null,
  open: null,
  timestamp: null,
};

module.exports.priceUpdate = (data) => {
  let { time, price } = data;
  // logger.info(`Received a price update ${time}`);

  // console.log(this.portfolio);

  price = Number(price);

  if (!this.candle.open) {
    this.candle.open = price;
  }

  if (!this.candle.high || this.candle.high < price) {
    this.candle.high = price;
  }

  if (!this.candle.low || this.candle.low > price) {
    this.candle.low = price;
  }

  this.candle.close = price;
};

module.exports.primeCandles = [];

module.exports.channel = 'ticker';

module.exports.product = 'BTC-EUR';

module.exports.trade = (amount, price, type) => {
  const timestamp = moment().unix();
  if (type === this.tradeTypes.BUY) {
    const fee = amount * this.fees;
    const buyingTotal = ((amount - fee) / price); // Total bitcoin
    // Remove the total of fiat used to buy
    this.portfolio.fiat -= amount;
    // Add the amount of crypto bought minus the fee
    this.portfolio.crypto += buyingTotal;
    // Add the trade to the list of trades
    this.trades.push({
      type: this.tradeTypes.BUY,
      total: buyingTotal,
      price,
      amount,
      fee,
      timestamp,
    });
    logger.info(`Buying ${buyingTotal} at ${price}`);
  } else if (type === this.tradeTypes.SELL) {
    const fee = amount * this.fees;
    const sellingTotal = ((amount - fee) * price); // Total fiat
    // Add the amount fiat profit minus the fee
    this.portfolio.fiat += sellingTotal - fee;
    // Remove the amount crypto sold
    this.portfolio.crypto -= amount;
    // Add the trade to the list of trades
    this.trades.push({
      type: this.tradeTypes.SELL,
      total: sellingTotal,
      price,
      amount,
      fee,
      timestamp,
    });
    logger.info(`Selling ${amount} at ${price}`);
  }

  logger.info('----------TRADES----------');
  logger.info(this.trades);
  logger.info('----------TRADES----------');
};

// TODO: Creat a general function that allows us to test trade, trade and backtest and import in all these

module.exports.requiredArguments = ['strategy', 'product'];

module.exports = async (args, test = false) => {
  logger.info('Starting CPTB! Feel free to abort while you can.');

  const strategy = () => {
    if (args.strategy) {
      const type = typeof args.strategy;
      if (type === 'string') {
        return args.strategy;
      }
      return false;
    }
    return false;
  };

  if (!strategy()) {
    logger.error('No strategy specified');
    logger.error('Please provide the name of the import you want to run against');
    logger.error('--strategy supermoon');
    return;
  }

  this.strategy = strategyLoader(strategy());

  // Call the strategy init function
  if (this.strategy.init) {
    logger.info('Init strategy');

    if (this.strategy.config.prime) {
      logger.info('Priming strategy with 300 datapoints');
      // Prime the strategy with 300 datapoints
      this.primeCandles = (await candles.get(this.product, '', '', this.tickerInterval / 1000)).data;
    }

    this.strategy.init(this);
  } else {
    logger.error('Could not init strategy');
    logger.error('Please make sure the strategy exists and has all the required functions');
    return;
  }

  // Display a short warning that we're running in test mode
  if (test) {
    logger.warn('Starting CPTB in test mode.');
  }

  // Fun quote from Jordan Belfort
  logger.info('------------------------------------------------------');
  logger.info('Let me tell you something.                            ');
  logger.info('    There’s no nobility in poverty.                   ');
  logger.info('        I’ve been a rich man and I’ve been a poor man.');
  logger.info('            And I choose rich every f**king time.     ');
  logger.info('                                                      ');
  logger.info('                                   – Jordan Belfort.  ');
  logger.info('------------------------------------------------------');

  // Create a new websocket client
  const client = websocket();

  // On opening the websocket client, keep eye open with ticket
  // (for now. level 2 might be more accurate)
  client.on('open', () => {
    // Send a subscribe message to the api
    client.send(JSON.stringify({
      type: 'subscribe',
      channels: [
        {
          name: this.channel,
          product_ids: [this.product],
        },
      ],
    }));
  });

  client.on('message', (data) => {
    const body = JSON.parse(data);
    // Run the bot on update received
    if (body.type === this.channel) {
      this.priceUpdate(body);
    } else {
      // logger.info(`Not a ${this.channel} update`);
      // logger.info(body);
    }
  });

  // Init the ticker
  setTimeout(this.ticker, this.tickerInterval);
};
