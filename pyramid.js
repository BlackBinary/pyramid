#!/usr/bin/env node

require('module-alias/register');
require('dotenv').config();

const { Command } = require('commander');

const importCommand = require('@core/commands/import');
const listCommand = require('@core/commands/list');
const backtestCommand = require('@core/commands/backtest');
const testCommand = require('@core/commands/test');

const program = new Command();

program
  .storeOptionsAsProperties(false)
  .passCommandToAction(false);

/** **************************************** */

// Import command
program
  .command('import')
  .alias('i')
  .description('Import historical data')
  .requiredOption('-i, --importName <name>', 'name of the import')
  .requiredOption('-p, --product <product>', 'product/trading pair', (value) => (value.toUpperCase()))
  .requiredOption('-d, --datapoints <amount>', 'amount of datapoints to use', parseInt)
  .requiredOption('-g, --granularity <60, 300, 900, 3600, 21600, 86400>', 'the granularity of the import', parseInt)
  .action((options) => {
    importCommand(options);
  });

// Test command
program
  .command('test')
  .alias('t')
  .requiredOption('-s, --strategy <strategy>', 'strategy to test')
  .requiredOption('-p, --pairs <pairs>', 'comma seperated trading pairs', (value) => value.split(','))
  .description('Test strategy against live data')
  .action((options) => {
    testCommand(options);
  });

// Backtest command
program
  .command('backtest')
  .alias('b')
  .description('Backtest strategy against historical data')
  .requiredOption('-i, --importName <name>', 'name of the import')
  .requiredOption('-s, --strategy <strategy>', 'strategy to test')
  .action((options) => {
    backtestCommand(options);
  });

// List command
program
  .command('list')
  .alias('l')
  .description('Show list of Pyramid data')
  .option('-i, --imports', 'show imports')
  // .option('-p, --portfolio', 'show portfolio') // Currently not implemented
  .action((options) => {
    listCommand(options);
  });

// Parse process.args using commander
program.parse(process.argv);
