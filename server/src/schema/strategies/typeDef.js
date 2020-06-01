const { gql } = require('apollo-server-express');

module.exports = gql`
  type Strategy {
    id: ID!
    name: String!
    description: String
    userId: ID!
    user: User
    options: JSONObject
    minBuy: Int!
    minSell: Int!
    createdAt: String
    updatedAt: String
  }

  type Indicator {
    id: ID!
    strategyId: ID!
    type: String!
    signal: Signal!
    params: JSONObject
    chartPeriod: Period!
    required: Boolean!
  }

  enum Signal {
    BUY
    SELL
  }

  scalar Period

  extend type Query {
    strategies: [Strategy]
    strategy(id: ID!): Strategy
  }

  extend type Mutation {
    createStrategy(name: String!, description: String): Strategy!
    deleteStrategy(id: ID!): Strategy
    createIndicator(strategyId: ID!, params: JSONObject!, chartPeriod: Period!, signal: Signal!, required: Boolean!): Indicator!
    deleteIndicator(id: ID!): Indicator
  }
`;
