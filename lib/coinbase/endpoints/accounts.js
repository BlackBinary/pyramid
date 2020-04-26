const client = require('../client');

module.exports.get = () => client.getRequest('/accounts', true);
