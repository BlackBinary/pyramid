/**
 * MACD CROSS 1
 * Author: Daen Rebel
 *
 * This strategy works in backtesting
 *
 * Strategy
 * Calc MACD over primed datapoints, and wait for at least 1 real datapoint
 * When MACD pos buy. When MACD neg sell
 */

const logger = require('@lib/logger')(false);
const BaseStrategy = require('@lib/strategy/base');

const ema = require('@lib/indicators/ema');
const sma = require('@lib/indicators/sma');

class Strategy extends BaseStrategy {
  constructor(test = false) {
    super(test);

    this.name = 'macd cross 1';

    this.config = {
      prime: true,
      signalAverageOver: 9,
      fastAverageOver: 12,
      slowAverageOver: 26,
      buyAt: 0,
      sellAt: -4,
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

    this.fastAverage = null;
    this.slowAverage = null;

    this.signal = null;
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

  update(candle) {
    this.prices.push(candle[this.config.tradeSignal]);

    if (this.priceCount() >= this.config.slowAverageOver && this.priceCount() >= this.config.fastAverageOver) {
      if (!this.fastAverage && !this.slowAverage) {
        this.fastAverage = sma(this.config.fastAverageOver, this.prices);
        this.slowAverage = sma(this.config.slowAverageOver, this.prices);
        this.signal = this.fastAverage - this.slowAverage;
      } else {
        this.fastAverage = ema(this.config.fastAverageOver, this.prices[this.prices.length - 1], this.fastAverage);
        this.slowAverage = ema(this.config.slowAverageOver, this.prices[this.prices.length - 1], this.slowAverage);
        this.signal = ema(this.config.signalAverageOver, this.fastAverage - this.slowAverage, this.macd);
      }

      // logger.info(`Fast average ${this.fastAverage}`);
      // logger.info(`Slow average ${this.slowAverage}`);
      // logger.info(`MACD signal  ${this.signal}`);

      if (this.signal > this.config.buyAt) {
        if (this.Trader.portfolio.fiat > 0) {
          logger.info('We should buy');
          this.Trader.trade(this.Trader.portfolio.fiat, this.prices[this.priceCount() - 1], this.Trader.tradeTypes.BUY);
        }
      } else if (this.signal < this.config.sellAt) {
        if (this.Trader.portfolio.crypto > 0) {
          logger.info('We should sell');
          this.Trader.trade(this.Trader.portfolio.crypto, this.prices[this.priceCount() - 1], this.Trader.tradeTypes.SELL);
        }
      }
    }
  }
}

module.exports = Strategy;
