'use strict';

const controller = require('./controller');

module.exports = (server) => {
    server.route({
        method: 'GET',
        path: '/',
        config: {
            auth: 'RequiresLogin'
        },
        handler: controller.getAllBooks
    });

    server.route({
        method: 'POST',
        path: '/',
        config: {
            auth: 'RequiresLogin'
        },
        handler: controller.createBook
    });

    server.route({
        method: 'GET',
        path: '/{bookId}',
        config: {
            auth: 'RequiresLogin'
        },
        handler: controller.getBook
    });

    server.route({
        method: 'PUT',
        path: '/{bookId}',
        config: {
            auth: 'RequiresLogin'
        },
        handler: controller.updateBook
    });

    server.route({
        method: 'GET',
        path: '/latest',
        config: {
            auth: 'RequiresLogin'
        },
        handler: controller.getLatestBook
    });

    server.route({
        method: 'GET',
        path: '/collections',
        config: {
            auth: 'RequiresLogin'
        },
        handler: controller.getCollectionsList
    });

    server.route({
        method: 'GET',
        path: '/names',
        config: {
            auth: 'RequiresLogin'
        },
        handler: controller.getCollectionNamesList
    });

    server.route({
        method: 'GET',
        path: '/collections/{collection}/volumes/{volume}',
        config: {
            auth: 'RequiresLogin'
        },
        handler: controller.getCollection
    });

    server.route({
        method: 'DELETE',
        path: '/{bookId}',
        config: {
            auth: 'RequiresLogin'
        },
        handler: controller.deleteBook
    });
};
