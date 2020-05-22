const { gql } = require('apollo-server-express');

module.exports = gql`
  type Strategy {
    id: ID!
    title: String!
    type: Int!
    description: String
    userId: ID!
    user: User
    createdAt: String
    updatedAt: String
  }

  extend type Query {
    strategies: [Strategy]
    myStrategies: [Strategy]
    strategy(id: ID!): Strategy
  }

  extend type Mutation {
    createStrategy(title: String!, type: Int!): Strategy!
  }
`;
