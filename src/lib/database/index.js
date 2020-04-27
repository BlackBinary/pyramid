const sqlite3 = require('sqlite3');

const logger = require('@lib/logger');

const packageJson = require('@root/package.json');

// TODO: This is a hack. Fix it
// eslint-disable-next-line no-underscore-dangle
module.exports.dbPath = `${packageJson._moduleAliases['@data']}database.sqlite`;

// Export a new sqlite db object
module.exports.client = new sqlite3.Database(this.dbPath, (err) => {
  if (err) {
    logger.error('Could not connect to database', err);
  } else {
    logger.info('Connected to database');
  }
});
