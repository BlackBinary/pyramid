const jwt = require('jsonwebtoken');

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
      'https://pyramid.scheme/graphql': {
        roles: [],
        permissions: [],
      },
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
    users: (parent, args, { models }) => models.User.findAll(),
  },
  Mutation: {
    register: async (parent, args, { dataSources }) => {
      const {
        email,
        firstName,
        lastName,
        password,
        passwordConfirmation,
      } = args;

      let user = await dataSources.models.User.findOne({ where: { email } });

      if (user) {
        throw new UserAlreadyExistsError('User with that email already exists');
      }

      if (password !== passwordConfirmation) {
        throw new PasswordsDoNotMatchError('Passwords do not match');
      }

      const passwordHash = auth.generatePasswordHash(password);

      user = await dataSources.models.User.create({
        email,
        firstName,
        lastName,
        password: passwordHash,
      });

      return generateAuthPayload(user);
    },
    login: async (parent, args, { dataSources }) => {
      const { email, password } = args;

      const user = await dataSources.models.User.findOne({ where: { email } });

      // TODO: Differentiate between users without password and invalid combinations
      if (!user || !user.password) {
        throw new EmailOrPasswordUnknownError('Email or password unknown');
      }

      const passwordValid = auth.comparePasswordHash(password, user.password);

      if (!passwordValid) {
        throw new EmailOrPasswordUnknownError('Email or password unknown');
      }

      return generateAuthPayload(user);
    },
  },
};
