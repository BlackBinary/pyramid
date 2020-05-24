const { ApolloServer, gql } = require('apollo-server-express');
const { GraphQLJSON, GraphQLJSONObject } = require('graphql-type-json');

const models = require('@server/src/models');

const users = require('@server/src/schema/users');
const strategies = require('@server/src/schema/strategies');

const defaultDef = gql`
  # Custom scalar JSON type see https://www.npmjs.com/package/graphql-type-json
  scalar JSON
  scalar JSONObject

  type Query
  type Mutation
`;

const resolveFunctions = {
  JSON: GraphQLJSON,
  JSONObject: GraphQLJSONObject,
};

module.exports = new ApolloServer({
  typeDefs: [
    defaultDef,
    users.typeDef,
    strategies.typeDef,
  ],
  resolvers: [
    resolveFunctions,
    users.resolvers,
    strategies.resolvers,
  ],
  dataSources: () => ({ models }),
  context: ({ req }) => {
    const user = req.user || null;

    return { user };
  },
});
