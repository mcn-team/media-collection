'use strict';

const controller = require('./controller');

module.exports = (server) => {
    server.route({
        method: 'GET',
        path: '/',
        config: {
            auth: 'RequiresLogin'
        },
        handler: controller.getMoviesList
    });
};
