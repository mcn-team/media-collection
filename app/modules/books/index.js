'use strict';

const logger = require('../../utils/logger');

const bookModule = {
    register: (server, options, next) => {
        try {
            require('./model');
            require('./routes')(server);
            logger.logLoading('Books');
        } catch (err) {
            logger.logLoading('Books', true);
            throw err;
        }
        next();
    }
};

bookModule.register.attributes = { name: 'books-module' };

exports = module.exports = bookModule;
