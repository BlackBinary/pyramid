module.exports = {
  Query: {
    ip: (parent, args, request) => request.ip,
    users: (parent, args, { models }) => models.User.findAll(),
  },
  Mutation: {
    createUser: async (parent, {
      email, firstname, lastName, prefix,
    }, { models }) => models.User.create({
      email, firstname, lastName, prefix,
    }),
  },
};
