/**
 * MACD CROSS
 * Author: Daen Rebel
 *
 * This strategy works in backtesting
 *
 * Strategy
 * Calc MACD over primed datapoints, and wait for at least 1 real datapoint
 * When MACD pos buy. When MACD neg sell
 */

const BaseStrategy = require('@root/server/src/lib/strategy/base');

const ema = require('@root/server/src/lib/indicators/ema');
const sma = require('@root/server/src/lib/indicators/sma');

class Strategy extends BaseStrategy {
  constructor(test = false) {
    super(test);

    this.name = 'macd cross';

    this.config = {
      signalAverage: 9,
      fastAverage: 12,
      slowAverage: 26,
      buyAt: 0,
      sellAt: -4,
      startAt: 9,
      tradeSignal: 'close',
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

    if (
      this.priceCount() >= this.config.slowAverage
      && this.priceCount() >= this.config.fastAverage
    ) {
      if (!this.fastAverage && !this.slowAverage) {
        this.fastAverage = sma(this.config.fastAverage, this.prices);
        this.slowAverage = sma(this.config.slowAverage, this.prices);
        this.signal = this.fastAverage - this.slowAverage;
      } else {
        this.fastAverage = ema(
          this.config.fastAverage,
          this.prices[this.prices.length - 1],
          this.fastAverage,
        );
        this.slowAverage = ema(
          this.config.slowAverage,
          this.prices[this.prices.length - 1],
          this.slowAverage,
        );
        this.signal = ema(
          this.config.signalAverage,
          this.fastAverage - this.slowAverage,
          this.macd,
        );
      }

      if (this.signal > this.config.buyAt) {
        if (this.Trader.portfolio.fiat > 0) {
          this.Trader.trade(
            this.Trader.portfolio.fiat,
            this.prices[this.priceCount() - 1],
            this.Trader.tradeTypes.BUY,
          );
        }
      } else if (this.signal < this.config.sellAt) {
        if (this.Trader.portfolio.crypto > 0) {
          this.Trader.trade(
            this.Trader.portfolio.crypto,
            this.prices[this.priceCount() - 1],
            this.Trader.tradeTypes.SELL,
          );
        }
      }
    }
  }
}

module.exports = Strategy;
