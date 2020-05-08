// Require module alias before anything else
require('module-alias/register');

// Require dotenv before any calls
require('dotenv').config();

// Require minimist for parsing command line args
const minimist = require('minimist');

// Various commands
const importData = require('@core/commands/import');
const listImportData = require('@core/commands/import/list');
const backtest = require('@core/commands/backtest');
const help = require('@core/commands/help');

// The main part of CPTB
const bot = require('@core/bot');

(async () => {
  // Parse the command line args and decide on what to do next
  const args = minimist(process.argv.slice(2));

  // Let the switch decide
  switch (true) {
    // case args.start:
    //   // Run CPTB
    //   bot(args);
    //   break;
    case args.test:
      // Run CPTB in test mode
      bot(args, true);
      break;
    case args.backtest:
      // Run backtesting
      backtest(args);
      break;
    case args.listimports:
      // Import historical data for backtesting
      listImportData();
      break;
    default:
      help();
      break;
  }
})();
