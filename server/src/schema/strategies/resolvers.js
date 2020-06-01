const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');
const { GraphQLError } = require('graphql/language');

const {
  AuthenticationError,
} = require('apollo-server-express');

const isPeriod = (value) => {
  const periodValue = parseInt(value, 10);
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

  return periods.includes(periodValue) ? periodValue : null;
};

module.exports = {
  Strategy: {
    indicators: (parent) => parent.getIndicators(),
  },
  Period: new GraphQLScalarType({
    name: 'Period',
    description: 'Time period scalar type. Must be one of: 60, 300, 900, 1800, 3600, 7200, 14400, 86400',
    parseValue: isPeriod,
    serialize: isPeriod,
    parseLiteral(ast) {
      console.log('hi');
      console.log(ast);
      if (ast.kind !== Kind.INT) {
        throw new GraphQLError('Period is not a valid value');
      }
      return isPeriod(ast.value);
    },
  }),
  Query: {
    indicators: (parent, args, { dataSources, user }) => {
      // User is not logged in
      if (!user) throw new AuthenticationError();

      console.log(dataSources);

      // Return all available indicators
      return [];
    },
    strategies: (parent, args, { dataSources, user }) => {
      // User is not logged in
      if (!user) throw new AuthenticationError();

      // Return all strategies a user is linked to
      return dataSources.models.Strategy.findAll({ where: { userId: user.sub } });
    },
    strategy: (parent, args, { dataSources, user }) => {
      // User is not logged in
      if (!user) throw new AuthenticationError();

      // Get the id of the strategy to query with
      const { id } = args;

      // Return the strategy by user and strategy id
      return dataSources.models.Strategy.findOne({ where: { id, userId: user.sub } });
    },
  },
  Mutation: {
    createStrategy: async (parent, args, { dataSources, user }) => {
      // User is not logged in
      if (!user) throw new AuthenticationError();

      // Get the data sent by the client
      const {
        name,
        description,
      } = args;

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
      // User is not logged in
      if (!user) throw new AuthenticationError();

      // Get the data sent by the client
      const {
        id,
      } = args;

      // Find and Delete strategyData object
      await dataSources.models.Strategy.destroy({
        where: {
          id,
        },
      });
    },
    createIndicator: async (parent, args, { dataSources, user }) => {
      // User is not logged in
      if (!user) throw new AuthenticationError();

      // Get the data sent by the client
      const {
        strategyId,
        type,
        signal,
        params,
        chartPeriod,
        required,
      } = args;

      // Set the new indicatorData object
      const indicatorData = await dataSources.models.Indicator.create({
        strategyId,
        type,
        signal,
        params,
        chartPeriod,
        required,
      });

      // Return the newly generated indicator
      return indicatorData;
    },
    // deleteIndicator: async (parent, args, { dataSources, user }) => {},
  },
};
