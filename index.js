// Require module alias before anything else
require('module-alias/register');

// Require dotenv before any calls
require('dotenv').config();

const accounts = require('@lib/coinbase/endpoints/accounts');

const main = async () => {
  const accountsData = await accounts.get();
  console.log(accountsData);
};

main();
