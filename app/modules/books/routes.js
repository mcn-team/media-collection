'use strict';

const controller = require('./controller');
const validator = require('./validator');

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
            auth: 'RequiresLogin',
            validate: { payload: validator.bookCreatePayload }
        },
        handler: controller.createBook
    });

    server.route({
        method: 'GET',
        path: '/{bookId}',
        config: {
            auth: 'RequiresLogin',
            validate: { params: validator.bookParams }
        },
        handler: controller.getBook
    });

    server.route({
        method: 'PATCH',
        path: '/{bookId}',
        config: {
            auth: 'RequiresLogin',
            validate: {
                params: validator.bookParams,
                payload: validator.bookEditPayload
            }
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
            auth: 'RequiresLogin',
            validate: { params: validator.collectionsParams }
        },
        handler: controller.getCollection
    });

    server.route({
        method: 'DELETE',
        path: '/{bookId}',
        config: {
            auth: 'RequiresLogin',
            validate: { params: validator.bookParams }
        },
        handler: controller.deleteBook
    });

    server.route({
        method: 'POST',
        path: '/many',
        config: {
            auth: 'RequiresLogin'
        },
        handler: controller.createMultiple
    });
};