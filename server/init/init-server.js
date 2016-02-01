'use strict';

const logger = require('../utils/logger');
const _ = require('lodash');

module.exports = (server) => {
    server.ext('onPreResponse', (request, reply) => {
        const statusCode = request.response.statusCode || request.response.output.statusCode || '???';
        logger.logRoute(statusCode, _.upperCase(request.method), request.path);
        reply.continue();
    });
};
