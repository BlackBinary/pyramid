/* eslint-disable max-classes-per-file */

class EmailOrPasswordUnknownError extends Error {
  constructor(message) {
    super(message);
    this.name = 'EmailOrPasswordUnknownError';
  }
}

class PasswordsDoNotMatchError extends Error {
  constructor(message) {
    super(message);
    this.name = 'PasswordsDoNotMatchError';
  }
}

class UserAlreadyExistsError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UserAlreadyExistsError';
  }
}

module.exports = {
  EmailOrPasswordUnknownError,
  PasswordsDoNotMatchError,
  UserAlreadyExistsError,
};
