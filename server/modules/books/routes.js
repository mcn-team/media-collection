'use strict';

const controller = require('./controller');

module.exports = (server) => {
    server.route({
        method: 'GET',
        path: '/',
        handler: controller.getAllBooks
    });
    server.route({
        method: 'POST',
        path: '/',
        handler: controller.createBook
    });
    server.route({
        method: 'GET',
        path: '/{bookId}',
        handler: controller.getBook
    });
};
