const client = require('@lib/coinbase/client');

module.exports.get = () => client.getRequest('/time', false);
