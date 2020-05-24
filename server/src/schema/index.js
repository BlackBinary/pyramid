const { ApolloServer, gql } = require('apollo-server-express');
const { GraphQLJSON, GraphQLJSONObject } = require('graphql-type-json');
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');

const models = require('@server/src/models');

const users = require('@server/src/schema/users');
const strategies = require('@server/src/schema/strategies');
const binance = require('@server/src/schema/binance');

const defaultDef = gql`
  # Custom scalar JSON type see https:www.npmjs.com/package/graphql-type-json
  scalar JSON
  scalar JSONObject

  # Custom scalar
  scalar Date

  type Query
  type Mutation
`;

const resolveFunctions = {
  JSON: GraphQLJSON,
  JSONObject: GraphQLJSONObject,
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
      return new Date(value);
    },
    serialize(value) {
      return value.getTime();
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10);
      }
      return null;
    },
  }),
};

module.exports = new ApolloServer({
  typeDefs: [
    defaultDef,
    users.typeDef,
    strategies.typeDef,
    binance.typeDef,
  ],
  resolvers: [
    resolveFunctions,
    users.resolvers,
    strategies.resolvers,
    binance.resolvers,
  ],
  dataSources: () => ({ models }),
  context: ({ req }) => {
    const user = req.user || null;

    return { user };
  },
});
