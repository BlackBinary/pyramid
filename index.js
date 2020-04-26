require('dotenv').config();

const accounts = require('./lib/coinbase/endpoints/accounts');

const main = async () => {
  const accountsData = await accounts.get();
  console.log(accountsData);
};

main();
