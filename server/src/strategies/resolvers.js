const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');

const {
  AuthenticationError,
} = require('apollo-server-express');

const isPeriod = (value) => {
  const periods = [
    60,
    300,
    900,
    1800,
    3600,
    7200,
    14400,
    86400,
  ];

  return periods.includes(value) ? value : null;
};

module.exports = {
  Period: new GraphQLScalarType({
    name: 'Period',
    description: 'Time period scalar type. Must be one of: 60, 300, 900, 1800, 3600, 7200, 14400, 86400',
    parseValue: isPeriod,
    serialize: isPeriod,
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return isPeriod(parseInt(ast.value, 10));
      }
      return null;
    },
  }),
  Query: {
    strategies: (parent, args, { dataSources }) => dataSources.models.Strategy.findAll(),
    myStrategies: (parent, args, { dataSources, user }) => {
      // User is not logged in
      if (!user) throw new AuthenticationError();

      // Return all strategies a user is linked to
      return dataSources.models.Strategy.findAll({ where: { userId: user.sub } });
    },

  },
  Mutation: {
    createStrategy: async (parent, args, { dataSources, user }) => {
      // Get the data sent by the client
      const {
        name,
        description,
      } = args;

      // User is not logged in
      if (!user) throw new AuthenticationError();

      // Set the new strategyData object
      const strategyData = await dataSources.models.Strategy.create({
        name,
        description,
        userId: user.sub,
      });

      // Return the newly generated strategy
      return strategyData;
    },
    deleteStrategy: async (parent, args, { dataSources, user }) => {
      // Get the data sent by the client
      const {
        id,
      } = args;

      // User is not logged in
      if (!user) throw new AuthenticationError();

      // Find and Delete strategyData object
      await dataSources.models.Strategy.destroy({
        where: {
          id,
        },
      });
    },
  },
};
