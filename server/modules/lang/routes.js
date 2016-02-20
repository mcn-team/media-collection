'use strict';

module.exports = (server) => {
    server.route({
        method: 'GET',
        path: '/',
        handler: (request, reply) => {
            if (request.query && request.query.lang) {

            }
            const lang = require('./language_' + request.query.lang + '.json');
            reply(lang).code(200);
        }
    });
};
