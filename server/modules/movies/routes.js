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
        handler: controller.getMoviesList
    });

    server.route({
        method: 'POST',
        path: '/',
        config: {
            auth: 'RequiresLogin',
            validate: { payload: validator.moviePayload }
        },
        handler: controller.createMovie
    });

    server.route({
        method: 'GET',
        path: '/{movieId}',
        config: {
            auth: 'RequiresLogin',
            validate: { params: validator.movieParams }
        },
        handler: controller.getMovie
    });
};
