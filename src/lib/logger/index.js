const signale = require('signale');

signale.config({
  displayTimestamp: true,
  displayDate: false,
});

// Export the logger for use in other parts of the application
module.exports = signale;
