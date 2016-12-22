'use strict';

const logger = require('../../utils/logger');

const authorsModule = {
    register: (server, options, next) => {
        try {
            require('./routes')(server);
            logger.logLoading('Authors');
        } catch (err) {
            logger.logLoading('Authors', true);
            throw err;
        }
        next();
    }
};

authorsModule.register.attributes = { name: 'authors-module' };

exports = module.exports = authorsModule;
