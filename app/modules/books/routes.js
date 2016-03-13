'use strict';

const controller = require('./controller');
const validator = require('./validator');

module.exports = (server) => {
    server.route({
        method: 'GET',
        path: '/',
        config: {
            auth: 'RequiresLogin',
            notes: 'Returns an array of Books model',
            description: 'Sends back the full book list registered in the database.'
        },
        handler: controller.getAllBooks
    });

    server.route({
        method: 'POST',
        path: '/',
        config: {
            auth: 'RequiresLogin',
            validate: { payload: validator.bookCreatePayload },
            notes: [ 'Returns a Book model' ],
            description: 'Takes a book object as payload, adds it to the database ' +
            'and sends back the newly added instance of Book model.'
        },
        handler: controller.createBook
    });

    server.route({
        method: 'GET',
        path: '/{bookId}',
        config: {
            auth: 'RequiresLogin',
            validate: { params: validator.bookParams },
            notes: [
                'Takes a Book ID as parameter',
                'Returns a single Book model'
            ],
            description: 'Sends back the Book model corresponding to the ' +
            'Mongo ObjectID passed as parameter.'
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
            },
            notes: [
                'Takes a Book ID as parameter',
                'Receives a partial/complete Book object as payload',
                'Returns a single Book model'
            ],
            description: 'Edit the book in the database corresponding to the ID parameter ' +
            'and sends back the corresponding Book model. Book model can be partially edited ' +
            'by passing an object containing only the fields to update.'
        },
        handler: controller.updateBook
    });

    server.route({
        method: 'GET',
        path: '/latest',
        config: {
            auth: 'RequiresLogin',
            notes: 'Returns a single Book model',
            description: 'Sends back the lastest Book model added to the database.'
        },
        handler: controller.getLatestBook
    });

    server.route({
        method: 'GET',
        path: '/collections',
        config: {
            auth: 'RequiresLogin',
            notes: [
                'Returns an array of Object',
                '[{',
                '_id: String,',
                'data: [ Object ],',
                'boughtTotal: Number,',
                'toBoughtTotal: Number,',
                'readTotal: Number,',
                'notReadTotal: Number,',
                'onGoingTotal: Number',
                '}]'
            ],
            description: 'Sends back an aggregate array or object with an "_id" field ' +
            'containing the collection\'s name and a "data" field containing an array of ' +
            'all Book models sharing the specified collection\'s name.'
        },
        handler: controller.getCollectionsList
    });

    server.route({
        method: 'GET',
        path: '/collections/names',
        config: {
            auth: 'RequiresLogin',
            notes: 'Returns an array of Strings',
            description: 'Sends back an array containing every collection\'s name registered ' +
            'in the database.'
        },
        handler: controller.getCollectionNamesList
    });

    server.route({
        method: 'GET',
        path: '/collections/{collection}/volumes/{volume}',
        config: {
            auth: 'RequiresLogin',
            validate: { params: validator.collectionsParams },
            notes: [
                'Takes an collection\'s name as parameter',
                'Takes a volume number as parameter',
                'Returns an array of Book models'
            ],
            description: 'Sends back an array containing the list of all books ' +
            'with the corresponding collection and a lower volume number ' +
            'registered in the database.'
        },
        handler: controller.getCollection
    });

    server.route({
        method: 'DELETE',
        path: '/{bookId}',
        config: {
            auth: 'RequiresLogin',
            validate: { params: validator.bookParams },
            notes: [
                'Takes a Book ID as parameter',
                'Returns 204 No Content'
            ],
            description: 'Removes the book whit the specified Mongo ObjectID ' +
            'passed as parameter from the database.'
        },
        handler: controller.deleteBook
    });

    server.route({
        method: 'POST',
        path: '/many',
        config: {
            auth: 'RequiresLogin',
            notes: [
                'Receives an array of Book object as payload',
                'Returns 204 No Content'
            ],
            description: 'Adds multiple Book model to database.'
        },
        handler: controller.createMultiple
    });
};
