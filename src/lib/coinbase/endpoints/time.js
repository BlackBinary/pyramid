const api = require('@lib/coinbase/api');

/**
 * Get the current time in date and epoch from Coinbase servers
 * @returns {Object}
 */
module.exports.get = () => api.getRequest('/time', false);
