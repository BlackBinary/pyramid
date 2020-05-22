const jwt = require('jsonwebtoken');
const {
  AuthenticationError,
} = require('apollo-server-express');
const { Op } = require('sequelize');

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
  // TODO: Add actual roles and permissions
  // Create new data for the token
  const data = {
    roles: [],
    permissions: [],
  };

  // Set the options
  const options = {
    algorithm: 'HS256',
    subject: user.id.toString(),
    expiresIn: '1d',
  };

  // Generate a new JWT token
  const token = jwt.sign(
    data,
    JWT_SECRET,
    options,
  );

  // Return a token, according to the AuthPayLoad type definition
  return { token };
};

module.exports = {
  User: {
    strategies: (parent) => parent.getStrategies(),
  },
  Query: {
    users: (parent, args, { dataSources }) => dataSources.models.User.findAll(),
    account: async (parent, args, { dataSources, user }) => {
      // User is not logged in
      if (!user) throw new AuthenticationError();

      // Return the user object
      return dataSources.models.User.findOne({ where: { id: user.sub } });
    },
  },
  Mutation: {
    updateAccount: async (parent, args, { dataSources, user }) => {
      // Get the user data sent by the client
      const {
        email,
        firstName,
        lastName,
      } = args;

      // User is not logged in
      if (!user) throw new AuthenticationError();

      // Check if we don't already have a user with that email address
      const existingEmailUserData = await dataSources.models.User.findOne({
        where: {
          email,
          id: {
            [Op.not]: user.sub,
          },
        },
      });

      // If a user with that email address already exists
      if (existingEmailUserData) {
        // Throw an error that the email is already in use
        throw new UserAlreadyExistsError('Email is already in use by another account');
      }

      // Get the current data from the existing user
      const userData = await dataSources.models.User.findOne({ where: { id: user.sub } });

      // Update the data according to the data provided
      await userData.update({
        email,
        firstName,
        lastName,
      });

      // Return the user object
      return userData;
    },
    registerAccount: async (parent, args, { dataSources }) => {
      // Get the user data sent by the client
      const {
        email,
        firstName,
        lastName,
        password,
        passwordConfirmation,
      } = args;

      // Check if there's not already an user with that email
      const existingUserData = await dataSources.models.User.findOne({ where: { email } });

      // If there is indeed user data with that email, throw an new error
      if (existingUserData) {
        throw new UserAlreadyExistsError('User with that email already exists');
      }

      // Check if the password and password confirmations match
      if (password !== passwordConfirmation) {
        // If the confirmations don't match, throw an error
        throw new PasswordsDoNotMatchError('Passwords do not match');
      }

      // Create a new password hash using the auth helper
      const passwordHash = auth.generatePasswordHash(password);

      // Set the new userData object
      const userData = await dataSources.models.User.create({
        email,
        firstName,
        lastName,
        password: passwordHash,
      });

      // Generate and return a JWT payload
      return generateAuthPayload(userData);
    },
    loginUser: async (parent, args, { dataSources }) => {
      // Get the username and password arguments the user tries to login with
      const { email, password } = args;

      // Get the user data by email
      const userData = await dataSources.models.User.findOne({ where: { email } });

      // TODO: Differentiate between users without password and invalid combinations
      if (!userData || !userData.password) {
        // Throw a generic error, to not disclose information about existing email
        throw new EmailOrPasswordUnknownError('Email or password unknown');
      }

      // Comparet the password agains the password hash
      const passwordValid = auth.comparePasswordHash(password, userData.password);

      // If the password is not valid
      if (!passwordValid) {
        // Throw a generic error, to not disclose information about password being invalid
        throw new EmailOrPasswordUnknownError('Email or password unknown');
      }

      // Generate and return a JWT payload
      return generateAuthPayload(userData);
    },
  },
};
