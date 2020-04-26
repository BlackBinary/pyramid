const client = require('../client');

module.exports.get = () => client.getRequest('/time', false);
