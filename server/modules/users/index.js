'use strict';

const userModule = {
    register: (server, options, next) => {
        //req model
        //req routes
        next();
    }
};

userModule.register.attributes = { name: 'users-module' };

module.exports = {
    module: userModule,
    options: {
        select: ['API'],
        routes: { prefix: '/api/users' }
    }
};
