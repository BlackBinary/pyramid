const moment = require('moment');

const logger = require('@lib/logger');
const { client: dbClient } = require('@lib/database');

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
    dbClient.all(query, [importName], (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
};

module.exports = async () => {
  logger.info('[IMPORT] List of imports');

  // Retrieve a list of all the imports
  const imports = await this.getImports();

  logger.info(`[IMPORT] Total available imports: ${imports.length}`);

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

    logger.info('[IMPORT] ----------------------------------------------');
    logger.info(`[IMPORT] Import ${id} imported on ${date}`);
    logger.info(`[IMPORT] Name        ${name}`);
    logger.info(`[IMPORT] Product     ${product}`);
    logger.info(`[IMPORT] Datapoints  ${datapoints}`);
    logger.info(`[IMPORT] Granularity ${granularity}`);
  }
};
