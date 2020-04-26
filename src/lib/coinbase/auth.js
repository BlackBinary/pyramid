const crypto = require('crypto');
const { get: getTimestamp } = require('@lib/coinbase/endpoints/time');
const logger = require('@lib/logger');

// Get the required vars from the env
const {
  COINBASE_KEY,
  COINBASE_SECRET,
  GENERATE_TIMESTAMP,
  COINBASE_PASSPHRASE,
} = process.env;

// Either generate or get a timestamp from the server based on env
module.exports.generateUnixTimestamp = async () => {
  if (GENERATE_TIMESTAMP && GENERATE_TIMESTAMP === 'server') {
    logger.warn('Please consider using timestamp local for improved speed');
    const { epoch } = await getTimestamp();
    return epoch;
  }
  return Date.now() / 1000;
};

// Generate a new HMAC signature to sign request with
module.exports.generateHMAC = (method, path, body = '', timestamp) => {
  let stringifiedBody = body;
  if (body) {
    // Stringify the body so it can be concatenated in the HMAC message
    stringifiedBody = JSON.stringify(body);
  }

  // Create the prehash string by concatenating required parts
  const message = `${timestamp}${method}${path}${stringifiedBody}`;

  // Decode the base64 secret
  const decodedSecret = Buffer.from(COINBASE_SECRET, 'base64');

  // Create a sha256 hmac with the secret
  const hmac = crypto.createHmac('sha256', decodedSecret);

  // Return the finalised HMAC
  return hmac.update(message).digest('base64');
};

// Generate the authentication headers all together
module.exports.generateAuthHeaders = async (method, path, body) => {
  // Either get or generate the unix timestamp based on the settings
  const timestamp = await this.generateUnixTimestamp();

  return {
    'CB-ACCESS-KEY': COINBASE_KEY,
    'CB-ACCESS-SIGN': this.generateHMAC(method, path, body, timestamp),
    'CB-ACCESS-TIMESTAMP': timestamp,
    'CB-ACCESS-PASSPHRASE': COINBASE_PASSPHRASE,
  };
};
