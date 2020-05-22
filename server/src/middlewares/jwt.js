const expressJwt = require('express-jwt');

const {
  JWT_SECRET,
} = process.env;

module.exports = expressJwt({
  secret: JWT_SECRET,
  algorithms: ['HS256'],
  credentialsRequired: false,
});
