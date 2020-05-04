const websocket = require('@lib/coinbase/websocket');
const logger = require('@lib/logger').scope('cptb');
const strategyLoader = require('@lib/helpers/strategy/loader');

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

module.exports.bot = (data) => {
  const { side, time, price } = data;
  logger.info('Received a price update');

  // if (side === 'buy') {
  //   // l;
  // }

  // logger.info(`Side: ${side}`);
  // logger.info(`Time: ${time}`);
  // logger.info(`Price: ${price}`);
};

module.exports.channel = 'ticker';

module.exports.products = ['BTC-EUR'];

module.exports = (args, test = false) => {
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
          product_ids: this.products,
        },
      ],
    }));
  });

  client.on('message', (data) => {
    const body = JSON.parse(data);
    // Run the bot on update received
    if (body.type === this.channel) {
      this.bot(body);
    } else {
      logger.info(`Not a ${this.channel} update`);
      logger.info(body);
    }
  });
};
