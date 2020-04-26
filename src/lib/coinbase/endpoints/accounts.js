const api = require('@lib/coinbase/api');

module.exports.get = () => api.getRequest('/accounts', true);
