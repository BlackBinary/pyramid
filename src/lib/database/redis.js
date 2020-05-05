const redis = require('redis');

const {
  REDIS_HOST,
  REDIS_PORT,
} = process.env;

// Create a new options object
module.exports.options = {
  host: REDIS_HOST || '127.0.0.1',
  port: REDIS_PORT || '6379',
};

// Export a new redis db client
module.exports.client = redis.createClient(this.options);
