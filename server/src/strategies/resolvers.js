const {
  AuthenticationError,
} = require('apollo-server-express');

module.exports = {
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
      // Get the user data sent by the client
      const {
        title,
        type,
      } = args;

      // User is not logged in
      if (!user) throw new AuthenticationError();

      // Set the new strategyData object
      const strategyData = await dataSources.models.Strategy.create({
        title,
        type,
        userId: user.sub,
      });

      // Return the newly generated strategy
      return strategyData;
    },
  },
};
