'use strict';

const logger = require('../../utils/logger');

const authModule = {
    register: (server, options, next) => {
        try {
            require('./authentication')(server);
            require('./auth.routes')(server);
            server.auth.strategy('RequiresLogin', 'ValidationLogin');
            server.auth.strategy('RequiresAdmin', 'ValidationLogin', false, { admin: true });
            server.auth.strategy('RequiresLoginStrict', 'LoginStrict');
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
