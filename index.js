// Require module alias before anything else
require('module-alias/register');

// Require dotenv before any calls
require('dotenv').config();

// Require minimist for parsing command line args
const minimist = require('minimist');

// Various commands
const importData = require('@core/commands/import');
const backtest = require('@core/commands/backtest');
const help = require('@core/commands/help');

// Bot
const bot = require('@core/bot');

const main = async () => {
  // Parse the command line args and decide on what to do next
  const args = minimist(process.argv.slice(2));

  // Let the switch decide
  switch (true) {
    case args.start:
      // Run CPTB
      bot();
      break;
    case args.backtest:
      // Run backtesting
      backtest();
      break;
    case args.import:
      // Import historical data for backtesting
      importData();
      break;
    default:
      help();
      break;
  }
};

main();
