const { ApolloServer } = require('apollo-server-express');

const models = require('@server/src/models');

const users = require('@server/src/users');

module.exports = new ApolloServer({
  typeDefs: [
    users.typeDef,
  ],
  resolvers: [
    users.resolvers,
  ],
  context: () => ({ models }),
});
