const winston = require('winston');
const moment = require('moment');

const packageJson = require('@root/package.json');

// TODO: This is a hack. Fix it
// eslint-disable-next-line no-underscore-dangle
module.exports.path = `${packageJson._moduleAliases['@data']}logs/`;

// Export the logger for use in other parts of the application
module.exports = (file = false) => {
  const transports = [new winston.transports.Console()];

  if (file) {
    transports.push(new winston.transports.File({ filename: `${this.path}/${moment().unix()}-pyramid.log` }));
  }

  return winston.createLogger({
    format: winston.format.combine(
      winston.format.simple(),
      winston.format.splat(),
    ),
    transports,
  });
};
