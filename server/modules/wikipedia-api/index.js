'use strict';

const wikipediaApiModule = {
    register: (server, options, next) => {
        require('./routes')(server);
        next();
    }
};

wikipediaApiModule.register.attributes = { name: 'wikipedia-api-module' };

module.exports = {
    module: wikipediaApiModule,
    options: {
        select: ['API'],
        routes: { prefix: '/api/wiki' }
    }
};
