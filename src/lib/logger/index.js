const winston = require('winston');
const moment = require('moment');

const packageJson = require('@root/package.json');

// TODO: This is a hack. Fix it
// eslint-disable-next-line no-underscore-dangle
module.exports.path = `${packageJson._moduleAliases['@data']}logs/`;

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.simple(),
    winston.format.splat(),
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: `${this.path}/${moment().unix()}-cptb.log` }),
  ],
});

// Export the logger for use in other parts of the application
module.exports = logger;
