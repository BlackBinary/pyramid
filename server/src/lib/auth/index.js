const bcrypt = require('bcrypt');

module.exports.saltRounds = 10;

module.exports.generatePasswordHash = (password) => bcrypt.hash(password, this.saltRounds);
