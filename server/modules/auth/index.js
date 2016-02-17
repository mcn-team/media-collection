'use strict';

const authModule = {
    register: (server, options, next) => {
        require('./authentication')(server);
        server.auth.strategy('RequiresLogin', 'ValidationLogin');
        next();
    }
};
authModule.register.attributes = { name: 'auth-module' };

module.exports = { module: authModule };
