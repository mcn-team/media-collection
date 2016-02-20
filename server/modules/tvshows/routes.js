'use strict';

const controllers = require('./controllers');
const validator = require('./validator');

module.exports = (server) => {
    server.route({
        method: 'GET',
        path: '/',
        config: {
            auth: 'RequiresLogin'
        },
        handler: controllers.getTvShowsList
    });

    server.route({
        method: 'POST',
        path: '/',
        config: {
            auth: 'RequiresLogin',
            validate: { payload: validator.createPayload }
        },
        handler: controllers.createTvShow
    });

    server.route({
        method: 'GET',
        path: '/{tvShowId}',
        config: {
            auth: 'RequiresLogin',
            validate: { params: validator.tvShowParams }
        },
        handler: controllers.getTvShow
    });

    server.route({
        method: 'PATCH',
        path: '/{tvShowId}',
        config: {
            auth: 'RequiresLogin',
            validate: {
                params: validator.tvShowParams,
                payload: validator.editPayload
            }
        },
        handler: controllers.updateTvShow
    });

    server.route({
        method: 'DELETE',
        path: '/{tvShowId}',
        config: {
            auth: 'RequiresLogin',
            validate: { params: validator.tvShowParams }
        },
        handler: controllers.deleteTvShow
    });

    server.route({
        method: 'GET',
        path: '/names',
        config: {
            auth: 'RequiresLogin'
        },
        handler: controllers.getCollectionNames
    });
};
