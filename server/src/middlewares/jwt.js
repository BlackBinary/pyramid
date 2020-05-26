const expressJwt = require('express-jwt');

const {
  JWT_SECRET,
} = process.env;

module.exports = [
  expressJwt({
    secret: JWT_SECRET,
    algorithms: ['HS256'],
    credentialsRequired: false,
  }),
  (err, req, res, next) => {
    if (err.code === 'invalid_token') return next();
    return next(err);
  },
];
