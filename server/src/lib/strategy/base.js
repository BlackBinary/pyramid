const Trader = require('@root/server/src/lib/trader');

class BaseStrategy {
  constructor(test = false) {
    this.Trader = new Trader(test);
  }
}

module.exports = BaseStrategy;
