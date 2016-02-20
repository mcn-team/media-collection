'use strict';

const langModule = {
    register: (server, options, next) => {
        require('./routes')(server);

        next();
    }
};

langModule.register.attributes = { name: 'lang-module' };

exports.module = langModule;
exports.options = {
    select: ['API'],
    routes: { prefix: '/api/lang' }
};
