const { ApolloServer, gql } = require('apollo-server-express');

const models = require('@server/src/models');

const users = require('@server/src/users');

const defaultDef = gql`
  type Query
  type Mutation
`;

module.exports = new ApolloServer({
  typeDefs: [
    defaultDef,
    users.typeDef,
  ],
  resolvers: [
    users.resolvers,
  ],
  dataSources: () => ({ models }),
  context: ({ req }) => {
    const user = req.user || null;

    return { user };
  },
});
