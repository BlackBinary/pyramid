const bcrypt = require('bcrypt');

module.exports.saltRounds = 10;

module.exports.generatePasswordHash = (password) => {
  const salt = bcrypt.genSaltSync(this.saltRounds);
  const hash = bcrypt.hashSync(password, salt);

  return hash;
};

module.exports.comparePasswordHash = (password, passwordHash) => {
  if (!password || !passwordHash) {
    return false;
  }

  const compareHash = bcrypt.compareSync(password, passwordHash);

  return compareHash;
};
