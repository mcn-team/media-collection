'use strict';

const googleBookApi = {
    register: (server, options, next) => {
        require('./routes')(server);
        next();
    }
};
googleBookApi.register.attributes = { name: 'google-book-api-module' };

module.exports = {
    module: googleBookApi,
    options: {
        select: ['API'],
        routes: { prefix: '/api' }
    }
};
