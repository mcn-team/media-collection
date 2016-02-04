'use strict';

const controller = require('./controller');

module.exports = (server) => {
    server.route({
        method: 'GET',
        path: '/',
        handler: controller.getBooks
    });
};
