# CPTB
CPTB is a trading bot for Coinbase Pro

## Disclaimer
CPTB is built as an experiment by me, for me (Daen Rebel). There is nobody who should use this bot. Especially if you're unaware of what you're doing.

## Env

The env file consists of the following contents:
```
GENERATE_TIMESTAMP=local // If set to server, client will use /time api endpoint to get timestamp for each request
COINBASE_API_URL=https://api.pro.coinbase.com // The default api endpoint, can be interchanged with the sandbox one
COINBASE_WS_URL=wss://ws-feed-public.pro.coinbase.com // The default websocket api endpoint, can be interchanged with the sandbox one
COINBASE_FIX_URL=tcp+ssl://fix.pro.coinbase.com:4198 // The default fix api endpoint, can be interchanged with the sandbox one
COINBASE_PASSPHRASE= // Your passphrase here
COINBASE_SECRET= // Your secret here
COINBASE_KEY= // Your key here
```