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

    server.route({
        method: 'PUT',
        path: '/{bookId}',
        handler: controller.updateBook
    });

    server.route({
        method: 'GET',
        path: '/latest',
        handler: controller.getLatestBook
    });

    server.route({
        method: 'GET',
        path: '/collections',
        handler: controller.getCollectionsList
    });

    server.route({
        method: 'GET',
        path: '/names',
        handler: controller.getCollectionNamesList
    });

    server.route({
        method: 'GET',
        path: '/collections/{collection}/volumes/{volume}',
        handler: controller.getCollection
    });
};
