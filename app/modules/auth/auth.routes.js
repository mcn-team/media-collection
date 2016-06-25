'use strict';

const controller = require('./auth.controllers');

exports = module.exports = (server) => {
    server.route({
        method: 'GET',
        path: '/key',
        config: {
            notes: 'Returns an Object',
            description: 'Returns a 200 OK response and sends back an Object ' +
            'containing the RSA public key to encrypt sensitive data.'
        },
        handler: controller.getPublicKey
    });
};
