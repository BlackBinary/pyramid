const jwt = require('jsonwebtoken');
const {
  AuthenticationError,
} = require('apollo-server-express');

const auth = require('@server/src/lib/auth');

const {
  JWT_SECRET,
} = process.env;

const {
  EmailOrPasswordUnknownError,
  PasswordsDoNotMatchError,
  UserAlreadyExistsError,
} = require('@server/src/users/errors');

const generateAuthPayload = (user) => {
  const token = jwt.sign(
    {
      roles: [],
      permissions: [],
    },
    JWT_SECRET,
    {
      algorithm: 'HS256',
      subject: user.id.toString(),
      expiresIn: '1d',
    },
  );

  return { token };
};

module.exports = {
  Query: {
    users: (parent, args, { dataSources }) => dataSources.models.User.findAll(),
    account: async (parent, args, { dataSources, user }) => {
      if (!user) throw new AuthenticationError();

      return dataSources.models.User.findOne({ where: { id: user.sub } });
    },
  },
  Mutation: {
    updateAccount: async (parent, args, { dataSources, user }) => {
      const {
        email,
        firstName,
        lastName,
      } = args;

      if (!user) throw new AuthenticationError();

      const userData = await dataSources.models.User.findOne({ where: { id: user.sub } });

      await userData.update({
        email,
        firstName,
        lastName,
      });

      return userData;
    },
    registerAccount: async (parent, args, { dataSources }) => {
      const {
        email,
        firstName,
        lastName,
        password,
        passwordConfirmation,
      } = args;

      let userData = await dataSources.models.User.findOne({ where: { email } });

      if (userData) {
        throw new UserAlreadyExistsError('User with that email already exists');
      }

      if (password !== passwordConfirmation) {
        throw new PasswordsDoNotMatchError('Passwords do not match');
      }

      const passwordHash = auth.generatePasswordHash(password);

      userData = await dataSources.models.User.create({
        email,
        firstName,
        lastName,
        password: passwordHash,
      });

      return generateAuthPayload(userData);
    },
    loginUser: async (parent, args, { dataSources }) => {
      const { email, password } = args;

      const userData = await dataSources.models.User.findOne({ where: { email } });

      // TODO: Differentiate between users without password and invalid combinations
      if (!userData || !userData.password) {
        throw new EmailOrPasswordUnknownError('Email or password unknown');
      }

      const passwordValid = auth.comparePasswordHash(password, userData.password);

      if (!passwordValid) {
        throw new EmailOrPasswordUnknownError('Email or password unknown');
      }

      return generateAuthPayload(userData);
    },
  },
};
