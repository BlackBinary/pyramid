const binance = require('@server/src/lib/binance');

module.exports = {
  Query: {
    getHistoricCandles: async (parent, args) => {
      console.log(args.input);
      const {
        input: {
          pair,
          interval,
          limit,
          startTime,
          endTime,
        },
      } = args;

      const ticksData = await new Promise((resolve, reject) => {
        binance.candlesticks(pair, interval, (error, ticks, symbol) => {
          console.log(symbol);
          if (error) {
            reject(error);
          }
          resolve(ticks);
        }, { limit, startTime, endTime });
      });

      return ticksData.map((tick) => {
        const [
          time,
          open,
          high,
          low,
          close,
          volume,
          closeTime,
          assetVolume,
          trades,
          buyBaseVolume,
          buyAssetVolume,
          ignored,
        ] = tick;

        return {
          time: new Date(time),
          open: parseFloat(open),
          high: parseFloat(high),
          low: parseFloat(low),
          close: parseFloat(close),
          volume: parseFloat(volume),
          closeTime: new Date(closeTime),
          assetVolume: parseFloat(assetVolume),
          trades: parseInt(trades, 10),
          buyBaseVolume: parseFloat(buyBaseVolume),
          buyAssetVolume: parseFloat(buyAssetVolume),
          ignored,
        };
      });
    },
  },
  Mutation: {},
};
