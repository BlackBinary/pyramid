const { gql } = require('apollo-server-express');

module.exports = gql`
  type Strategy {
    id: ID!
    name: String!
    description: String
    userId: ID!
    user: User
    createdAt: String
    updatedAt: String
  }

  type Indicator {
    id: ID!
    name: String!
  }

  type StrategyIndicator {
    id: ID!
    strategyId: ID!
    indicatorId: ID!
    type: Signal!
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
    myStrategies: [Strategy]
    strategy(id: ID!): Strategy
  }

  extend type Mutation {
    createStrategy(name: String!, description: String): Strategy!
    deleteStrategy(id: ID!): Strategy
    # createStrategyIndicator(strategyId: ID!, indicatorId: ID!, params: JSONObject!, chartPeriod: Period!, type: Signal!, required: Boolean!): StrategyIndicator!
    # deleteStrategyIndicator(id: ID!): StrategyIndicator
  }
`;
