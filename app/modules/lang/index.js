'use strict';

const logger = require('../../utils/logger');

const langModule = {
    register: (server, options, next) => {
        try {
            require('./lang')();
            require('./routes')(server);
            logger.logLoading('Lang');
        } catch (err) {
            logger.logLoading('Lang', true);
            throw err;
        }
        next();
    }
};

langModule.register.attributes = { name: 'lang-module' };

exports = module.exports = langModule;
