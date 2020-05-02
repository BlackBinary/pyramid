const api = require('@lib/coinbase/api');

/**
 * Get the historic rates for a product
 * @param {string} productId - The product
 * @param {string} start - Start time in ISO 8601
 * @param {string} end - End time in ISO 8601
 * @param {string} granularity - Desired timeslice in seconds
 * @returns {Promise}
 */
module.exports.get = (productId, start = null, end = null, granularity = 60) => api.getRequest(`/products/${productId}/candles?start=${start}&end=${end}&granularity=${granularity}`, true);
