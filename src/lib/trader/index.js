const moment = require('moment');

const logger = require('@lib/logger')(true);

class Trader {
  constructor(test = false) {
    this.test = test;

    logger.info('Starting');
    if (this.test) {
      logger.info('Test mode on');
      this.portfolio = {
        fiat: 1000,
        crypto: 0,
      };
    } else {
      this.portfolio = {
        fiat: 0,
        crypto: 0,
      };
    }

    this.fees = 0.5 / 100;
    this.tradeTypes = {
      SELL: 'SELL',
      BUY: 'BUY',
    };

    this.trades = [];
  }

  calculateFee(amount) {
    return amount * this.fees;
  }

  calculateTotal(amount) {
    return amount - this.calculateFee(amount);
  }

  trade(amount, price, type) {
    const timestamp = moment().unix();

    if (type === this.tradeTypes.BUY) {
      const buyingCost = this.calculateTotal(amount) / price;

      // Remove the total of fiat used to buy
      this.portfolio.fiat -= amount;

      // Add the amount of crypto bought minus the fee
      this.portfolio.crypto += buyingCost;

      // Add the trade to the list of trades
      this.trades.push({
        type: this.tradeTypes.BUY,
        total: buyingCost,
        price,
        amount,
        timestamp,
      });

      logger.info(`Buying ${buyingCost} at ${price} for ${amount}`);
    } else if (type === this.tradeTypes.SELL) {
      const sellingProfit = this.calculateTotal(amount) * price; // Total fiat

      // Add the amount fiat profit minus the fee
      this.portfolio.fiat += sellingProfit;

      // Remove the amount crypto sold
      this.portfolio.crypto -= amount;

      // Add the trade to the list of trades
      this.trades.push({
        type: this.tradeTypes.SELL,
        total: sellingProfit,
        price,
        amount,
        timestamp,
      });

      logger.info(`Selling ${amount} at ${price} for ${sellingProfit}`);
    }
  }
}

module.exports = Trader;
