const { Database } = require('sqlite3');

const logger = require('@lib/logger');

const packageJson = require('@root/package.json');

// TODO: This is a hack. Fix it
// eslint-disable-next-line no-underscore-dangle
module.exports.path = `${packageJson._moduleAliases['@data']}database.sqlite`;

// Export a new sqlite db client
module.exports.client = new Database(this.path, (err) => {
  if (err) {
    logger.error('Could not connect to database', err);
  } else {
    logger.info('Connected to database');
  }
});
