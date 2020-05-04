const WebSocket = require('ws');

// Get the coinbase ws url from the env
const {
  COINBASE_WS_URL,
} = process.env;

module.exports = () => new WebSocket(COINBASE_WS_URL);
