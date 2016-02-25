'use strict';

const logger = require('../../utils/logger');

const wikipediaApiModule = {
    register: (server, options, next) => {
        try {
            require('./routes')(server);
            logger.logLoading('Wikipedia Search API');
        } catch (err) {
            logger.logLoading('Wikipedia Search API', true);
            throw err;
        }
        next();
    }
};

wikipediaApiModule.register.attributes = { name: 'wikipedia-api-module' };

exports = module.exports = wikipediaApiModule;
