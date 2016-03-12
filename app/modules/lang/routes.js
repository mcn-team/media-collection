'use strict';

const controllers = require('./controllers');

module.exports = (server) => {
    server.route({
        method: 'GET',
        path: '/',
        handler: controllers.getAllLanguages
    });
};
