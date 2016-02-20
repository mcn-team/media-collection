'use strict';

const allocineApiModule = {
    register: (server, options, next) => {
        require('./routes')(server);

        next();
    }
};

allocineApiModule.register.attributes = { name: 'allocine-api-module' };

exports.module = allocineApiModule;
exports.options = {
    select: ['API'],
    routes: { prefix: '/api/allocine' }
};
