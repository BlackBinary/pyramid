const api = require('@lib/coinbase/api');

/**
 * Get the accounts linked to API credentials
 * @returns {Array}
 */
module.exports.get = () => api.getRequest('/accounts', true);
