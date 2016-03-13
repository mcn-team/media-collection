'use strict';

const controller = require('./controller');
const validator = require('./validator');

module.exports = (server) => {
    server.route({
        method: 'GET',
        path: '/',
        config: {
            auth: 'RequiresLogin',
            notes: 'Returns an array of Movies model',
            description: 'Sends back the full movie list registered in the database.'
        },
        handler: controller.getMoviesList
    });

    server.route({
        method: 'POST',
        path: '/',
        config: {
            auth: 'RequiresLogin',
            validate: { payload: validator.moviePayload },
            notes: [
                'Receives a Movie object as payload',
                'Returns a Movie model'
            ],
            description: 'Adds the movie object received to the database ' +
            'and sends back the newly added instance of Movie model.'
        },
        handler: controller.createMovie
    });

    server.route({
        method: 'GET',
        path: '/{movieId}',
        config: {
            auth: 'RequiresLogin',
            validate: { params: validator.movieParams },
            notes: [
                'Takes a Movie ID as parameter',
                'Returns a single Movie model'
            ],
            description: 'Sends back the Movie model corresponding to the ' +
            'Mongo ObjectID passed as parameter.'
        },
        handler: controller.getMovie
    });

    server.route({
        method: 'PATCH',
        path: '/{movieId}',
        config: {
            auth: 'RequiresLogin',
            validate: {
                params: validator.movieParams,
                payload: validator.editMoviePayload
            },
            notes: [
                'Takes a Movie ID as parameter',
                'Receives a partial/complete Movie object as payload',
                'Returns a single Movie model'
            ],
            description: 'Edit the movie document in the database corresponding to the ID parameter ' +
            'and sends back the corresponding Movie model. Movie model can be partially edited ' +
            'by passing an object containing only the fields to update.'
        },
        handler: controller.updateBook
    });

    server.route({
        method: 'DELETE',
        path: '/{movieId}',
        config: {
            auth: 'RequiresLogin',
            validate: { params: validator.movieParams },
            notes: [
                'Takes a Movie ID as parameter',
                'Returns 204 No Content'
            ],
            description: 'Removes the movie document with the specified Mongo ObjectID ' +
            'passed as parameter from the database.'
        },
        handler: controller.deleteMovie
    });

    server.route({
        method: 'GET',
        path: '/latest',
        config: {
            auth: 'RequiresLogin',
            notes: 'Returns a single Movie model',
            description: 'Sends back the lastest Movie model added to the database.'
        },
        handler: controller.getLatestMovie
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
            'all Movie models sharing the specified collection\'s name.'
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
        handler: controller.getCollectionNames
    });
};
