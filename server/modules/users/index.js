'use strict';

const logger = require('../../utils/logger');

const userModule = {
    register: (server, options, next) => {
        try {
            require('./model');
            require('./routes')(server);
            logger.logLoading('Users');
        } catch (err) {
            logger.logLoading('Users', true);
            throw err;
        }
        next();
    }
};

userModule.register.attributes = { name: 'users-module' };

exports = module.exports = userModule;
