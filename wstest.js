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
      channels: [
        {
          name: 'ticker',
          product_ids: ['BTC-EUR'],
        },
      ],
    }));
  });

  ws.on('message', (data) => {
    console.log(JSON.stringify(JSON.parse(data), null, 2));
  });
})();
