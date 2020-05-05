const moment = require('moment');

const logger = require('@lib/logger').scope('list import');
const { client: sqlite } = require('@lib/database/sqlite');

module.exports.getImports = async (importName) => {
  const query = `
  SELECT
    id,
    name,
    product,
    timestamp,
    datapoints,
    granularity
  FROM imports;
  `;

  return new Promise((resolve, reject) => {
    sqlite.all(query, [importName], (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
};

module.exports = async () => {
  logger.info('List of imports');

  // Retrieve a list of all the imports
  const imports = await this.getImports();

  logger.info(`Total available imports: ${imports.length}`);

  for (let i = 0; i < imports.length; i += 1) {
    const {
      id,
      name,
      product,
      timestamp,
      datapoints,
      granularity,
    } = imports[i];

    const date = moment.unix(timestamp).format();

    logger.info('----------------------------------------------');
    logger.info(`Import ${id} imported on ${date}`);
    logger.info(`Name        ${name}`);
    logger.info(`Product     ${product}`);
    logger.info(`Datapoints  ${datapoints}`);
    logger.info(`Granularity ${granularity}`);
  }
};
