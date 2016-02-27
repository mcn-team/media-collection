'use strict';

const _ = require('lodash');

const logger = require('../utils/logger');
const config = require('../config');

module.exports = (server) => {
    const writeLog = (request) => {
        const statusCode = request.response.statusCode || request.response.output.statusCode || '???';
        logger.logRoute(statusCode, _.upperCase(request.method), request.path);
    };

    server.ext('onPreResponse', (request, reply) => {
        const isApi = !(_.indexOf(request.path, '.') > 0) && request.path !== '/';

        if (isApi && config.logRoute) {
            writeLog(request);
        }

        if (!isApi && config.logFiles) {
            writeLog(request);
        }

        reply.continue();
    });
};
