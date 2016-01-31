'use strict';

const Hapi = require('hapi');
const _ = require('lodash');
const Chalk = require('chalk');
const config = require('./config');

// Create the HAPI server and set his parameters if needed
const server = new Hapi.Server();

// Set the different server listeners
_.forEach(config.connections, (element) => {
    server.connection(element);
});

// Call all initialisation modules
require('./init');

Chalk.enabled = config.colors;

server.start((err) => {
    if (err) {
        throw err;
    }
    console.log(Chalk.green('Media Collection server is up and running'));
    _.forEach(config.connections, (element) => {
        const info = element.labels && element.labels[0] ? ' for ' + Chalk.bold(element.labels[0]) : '';
        console.log(Chalk.blue('Listening' + info + ' on port ' + Chalk.bold(element.port)));
    });
});
