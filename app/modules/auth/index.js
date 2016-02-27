'use strict';

const logger = require('../../utils/logger');

const authModule = {
    register: (server, options, next) => {
        try {
            require('./authentication')(server);
            server.auth.strategy('RequiresLogin', 'ValidationLogin');
            logger.logLoading('Auth');
        } catch (err) {
            logger.logLoading('Auth', true);
            throw err;
        }
        next();
    }
};
authModule.register.attributes = { name: 'auth-module' };

exports = module.exports = authModule;
