'use strict';

const mongoose = require('mongoose');
const config = require('../config');
const logger = require('../utils/logger');
const Chalk = require('chalk');

mongoose.connect(config.dbConnectionString, (err) => {
    if (err) {
        console.log(Chalk.red('Failed to connect to database'));
        throw err;
    }
    console.log(Chalk.blue('Connected to database on ') + Chalk.blue.bold(config.dbConnectionString));
});
