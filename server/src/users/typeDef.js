const { gql } = require('apollo-server-express');

module.exports = gql`
  type User {
    id: ID!
    email: String!
    firstName: String
    lastName: String
    strategies: [Strategy]
    createdAt: String
    updatedAt: String
  }

  type AuthPayLoad {
    token: String!
  }

  extend type Query {
    users: [User]
    user(id: Int!): User
    account: User
  }

  extend type Mutation {
    registerAccount(email: String!, firstName: String!, lastName: String!, password: String!, passwordConfirmation: String!): AuthPayLoad!
    loginUser(email: String!, password: String!): AuthPayLoad!
    updateAccount(email: String!, firstName: String!, lastName: String!): User!
  }
`;
