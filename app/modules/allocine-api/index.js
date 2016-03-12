'use strict';

const logger = require('../../utils/logger');

const allocineApiModule = {
    register: (server, options, next) => {
        try {
            require('./routes')(server);
            logger.logLoading('Allocine Search API');
        } catch (err) {
            logger.logLoading('Allocine Search API', true, () => {
                throw err;
            });
        }
        next();
    }
};

allocineApiModule.register.attributes = { name: 'allocine-api-module' };

exports = module.exports = allocineApiModule;
