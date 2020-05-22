const { gql } = require('apollo-server-express');

module.exports = gql`
  type User {
    id: ID!
    email: String!
    firstName: String
    lastName: String
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
    register(email: String!, firstName: String!, lastName: String!, password: String!, passwordConfirmation: String!): AuthPayLoad!
    login(email: String!, password: String!): AuthPayLoad!
  }
`;
