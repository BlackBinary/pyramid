/**
 * MACD CROSS 1
 * Author: Daen Rebel
 *
 * This strategy works
 *
 * Strategy
 * Calc MACD over primed datapoints, and wait for at least 1 real datapoint
 * When MACD pos buy. When MACD neg sell
 */

const name = 'macd cross 1';

const logger = require('@lib/logger').scope(name);
const BaseStrategy = require('@lib/strategy/base');

const ema = require('@lib/indicators/ema');
const sma = require('@lib/indicators/sma');

class Strategy extends BaseStrategy {
  constructor(test = false) {
    super(test);

    this.name = name;

    this.config = {
      prime: true,
      fastAverageOver: 12,
      slowAverageOver: 26,
      buyAt: 20,
      sellAt: -1,
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

    this.macdIndex = 0;
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
      } else {
        this.fastAverage = ema(this.config.fastAverageOver, this.prices[this.prices.length - 1], this.fastAverage);
        this.slowAverage = ema(this.config.slowAverageOver, this.prices[this.prices.length - 1], this.slowAverage);
      }

      const macd = this.fastAverage - this.slowAverage;

      logger.info(`Fast average ${this.fastAverage}`);
      logger.info(`Slow average ${this.slowAverage}`);
      logger.info(`MACD         ${macd}`);

      if (macd > this.config.buyAt) {
        if (this.Trader.portfolio.fiat > 0) {
          logger.info('We should buy');
          this.Trader.trade(this.Trader.portfolio.fiat, this.prices[this.priceCount() - 1], this.Trader.tradeTypes.BUY);
        }
      } else if (macd < this.config.sellAt) {
        if (this.Trader.portfolio.crypto > 0) {
          logger.info('We should sell');
          this.Trader.trade(this.Trader.portfolio.crypto, this.prices[this.priceCount() - 1], this.Trader.tradeTypes.SELL);
        }
      }
    }
  }
}

module.exports = Strategy;
