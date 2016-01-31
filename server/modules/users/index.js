'use strict';

const userModule = {
    register: (server, options, next) => {
        require('./model');
        require('./routes')(server);
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
