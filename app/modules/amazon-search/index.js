'use strict';

const logger = require('../../utils/logger');

const amazonSearchModule = {
    register: (server, options, next) => {
        try {
            require('./routes')(server);
            logger.logLoading('Amazon search API');
        } catch (err) {
            logger.logLoading('Amazon search API', true);
            throw err;
        }
        next();
    }
};

amazonSearchModule.register.attributes = { name: 'amazon-search-module' };

exports = module.exports = amazonSearchModule;
