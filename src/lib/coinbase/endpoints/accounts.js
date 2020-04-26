const client = require('@lib/coinbase/client');

module.exports.get = () => client.getRequest('/accounts', true);
