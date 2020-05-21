const { ApolloServer } = require('apollo-server-express');

const models = require('@server/src/models');

const typeDefs = require('@server/src/types');
const resolvers = require('@server/src/resolvers');

module.exports = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => ({ models }),
});
