const moment = require('moment');
const EventEmitter = require('events');

const logger = require('@root/server/src/lib/logger')(true);
// const websocket = require('@root/server/src/lib/coinbase/websocket');

const initMessage = require('./initMessage');

class Pyramid extends EventEmitter {
  constructor(pairs = [], minutes = 1) {
    super();
    // Display the init message
    initMessage.forEach((i) => logger.info(i));

    // Set the trading pairs
    this.pairs = pairs.map((pair) => pair.toUpperCase());

    // Set a timeout for the heartbeat
    this.heartbeatTimeout = 1000 * 15;

    // Set the ticker interval
    this.tickerInterval = 1000 * 60 * minutes;

    // Set the current date for the ticker
    this.lastTime = Date.now();

    // Init the last ticker delay
    this.lastDelay = this.tickerInterval;

    // Create a new initial candle
    this.candle = {
      high: null,
      low: null,
      close: null,
      open: null,
      timestamp: null,
    };

    // Define the channels we need to subscribe to
    this.channels = [
      'ticker',
      'heartbeat',
    ];

    // Create a new subscribe message
    this.subscribeMessage = JSON.stringify({
      type: 'subscribe',
      channels: this.channels.map((name) => ({ name, product_ids: this.pairs })),
    });
  }

  ticker() {
    this.candle.timestamp = moment().unix();

    // EMIT
    this.emit('tick', this.candle);

    // Set all the keys in candle to the close price
    const { close } = this.candle;

    Object.keys(this.candle).forEach((key) => { this.candle[key] = close; });

    const now = Date.now();
    const dTime = now - this.lastTime;

    this.lastTime = now;
    this.lastDelay = this.tickerInterval + this.lastDelay - dTime;

    setTimeout(this.ticker.bind(this), this.lastDelay);
  }

  update({ time, price }) {
    logger.info(`Received a price update ${time}`);

    const parsed = parseFloat(price);

    if (!this.candle.open) {
      this.candle.open = parsed;
    }

    if (!this.candle.high || this.candle.high < parsed) {
      this.candle.high = parsed;
    }

    if (!this.candle.low || this.candle.low > parsed) {
      this.candle.low = parsed;
    }

    this.candle.close = parsed;
  }

  start() {
    logger.info('Starting Pyramid');

    //   const client = websocket();

    //   // On opening the websocket client, keep eye open with ticker
    //   // (for now. level 2 might be more accurate)
    //   client.on('open', () => {
    //     // Send a subscribe message to the api
    //     client.send(this.subscribeMessage);
    //   });

    //   client.on('message', (data) => {
    //     const body = JSON.parse(data);

    //     // Run the update function
    //     if (body.type === 'ticker') {
    //       this.update(body);
    //     }

    //     // Process the heartbeat
    //     if (body.type === 'heartbeat') {
    //       // Remove the previous heartbeat
    //       clearTimeout(this.heartbeat);

    //       // Set a new one
    //       this.heartbeat = setTimeout(() => {
    //         logger.warn(`We have not received a hearbeat for about ${this.heartbeatTimeout}`);
    //         client.send(this.subscribeMessage);
    //       }, this.heartbeatTimeout);
    //     }
    //   });

    setTimeout(this.ticker.bind(this), this.tickerInterval);
  }
}

module.exports = Pyramid;
