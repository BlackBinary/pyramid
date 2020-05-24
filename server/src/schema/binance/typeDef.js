const { gql } = require('apollo-server-express');

module.exports = gql`
  type Tick {
    time: Date
    open: Float
    high: Float
    low: Float
    close: Float
    volume: Float
    closeTime: Date
    assetVolume: Float
    trades: Int
    buyBaseVolume: Float
    buyAssetVolume: Float
  }

  input HistoricCandleInput {
    symbol: String!
    interval: String! = "5m"
    limit: Int! = 500
    startTime: Int
    endTime: Int
  }

  extend type Query {
    historicCandles(input: HistoricCandleInput): [Tick]
  }
`;
