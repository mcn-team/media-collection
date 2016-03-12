'use strict';

const config = require('../../config');

module.exports = (server) => {
    server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: './webapp/main/public',
                redirectToSlash: true,
                index: true
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/covers/{param*}',
        handler: {
            directory: {
                path: './' + config.coverDirectory,
                redirectToSlash: true,
                index: true
            }
        }
    });
};
