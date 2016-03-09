'use strict';

const controllers = require('./controllers');
const validator = require('./validator');

module.exports = (server) => {
    server.route({
        method: 'GET',
        path: '/',
        handler: controllers.getAllLanguages
    });
};
