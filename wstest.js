// Require dotenv before any calls
require('dotenv').config();

const WebSocket = require('ws');

// Get the coinbase api url from the env
const {
  COINBASE_WS_URL,
} = process.env;

(() => {
  const ws = new WebSocket(COINBASE_WS_URL);

  ws.on('open', () => {
    console.log('Connected');
    ws.send(JSON.stringify({
      type: 'subscribe',
      product_ids: [
        'ETH-USD',
        'ETH-EUR',
      ],
      channels: [
        'level2',
        'heartbeat',
        {
          name: 'ticker',
          product_ids: [
            'ETH-BTC',
            'ETH-USD',
          ],
        },
      ],
    }));
  });

  ws.on('message', (data) => {
    console.log(data);
  });
})();
