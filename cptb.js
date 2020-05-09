// Require module alias before anything else
require('module-alias/register');

// Require dotenv before any calls
require('dotenv').config();

// Require minimist for parsing command line args

// The main part of CPTB
const bot = require('@core/bot');

bot();
