const binance = require('@server/src/lib/binance');

module.exports = {
  Query: {
    historicCandles: async (parent, args) => {
      const {
        input: {
          symbol,
          interval,
          limit,
          startTime,
          endTime,
        },
      } = args;

      const parsedSymbol = symbol.toUpperCase();

      const ticksData = await new Promise((resolve, reject) => {
        binance.candlesticks(parsedSymbol, interval, (error, ticks, rSymbol) => {
          console.log(rSymbol);
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
