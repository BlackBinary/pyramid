const { gql } = require('apollo-server-express');

module.exports = gql`
  type User {
    id: ID!,
    email: String!,
    firstName: String,
    lastName: String,
    prefix: String,
    createdAt: String,
    updatedAt: String,
  }

  type Query {
    ip: String,
    users: [User],
    user(id: Int!): User,
  }

  type Mutation {
    createUser(email: String, firstname: String, lastName: String, prefix: String): User!
  }
`;
