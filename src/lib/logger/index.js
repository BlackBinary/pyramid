const pino = require('pino');

// Create a new pino logger with options
const logger = pino({
  prettyPrint: true,
});

// Export the logger for use in other parts of the application
module.exports = logger;
