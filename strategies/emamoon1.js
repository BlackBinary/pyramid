/**
 * EMA MOON 1
 * Author: Daen Rebel
 *
 * This strategy seems to work. I need someone to help me verify
 *
 * Strategy
 * NONE
 */

const logger = require('@lib/logger')(false);
const BaseStrategy = require('@lib/strategy/base');

const ema = require('@lib/indicators/ema');
const sma = require('@lib/indicators/sma');

class Strategy extends BaseStrategy {
  constructor(test = false) {
    super(test);

    this.name = 'ema moon 1';

    this.config = {
      prime: true,
      averageOver: 5,
      //   buyAt: 2,
      //   sellAt: -2,
      startAt: 9,
      tradeSignal: 'close',
      backtesting: {
        portfolio: {
          fiat: 1000,
          crypto: 0,
        },
      },
    };

    this.prices = [];

    this.ema = 0;
    this.emaIndex = 0;
  }

  priceCount() {
    return this.prices.length;
  }

  init(primeCandles = []) {
    logger.info('Starting strategy');

    if (primeCandles.length) {
      this.prices = primeCandles.reverse()
        .map(([time, low, high, open, close, volume]) => ({
          time, low, high, open, close, volume,
        }))
        .map((obj) => obj[this.config.tradeSignal]);
    }
  }

  update(candle = {}) {
    this.prices.push(candle[this.config.tradeSignal]);

    if (this.priceCount() >= this.config.averageOver) {
      if (!this.ema) {
        // Set the ema to the sma for the first time
        this.ema = sma(this.config.averageOver, this.prices);
      } else {
        this.ema = ema(this.config.averageOver, this.prices[this.prices.length - 1], this.ema);
        this.emaIndex += 1;
      }

      if (this.emaIndex >= this.config.startAt) {
        console.log(this.ema);
        // We have an accurate ema enough to do stuff
      }
    }
  }
}

module.exports = Strategy;
