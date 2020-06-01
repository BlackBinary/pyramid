const { gql } = require('apollo-server-express');

module.exports = gql`
  # Custom scalar JSON type see https:www.npmjs.com/package/graphql-type-json
  scalar JSON
  scalar JSONObject

  # Custom scalar
  scalar Date

  type Query
  type Mutation
`;
