'use strict';

const bookModule = {
    register: (server, options, next) => {
        require('./model');
        next();
    }
};

bookModule.register.attributes = { name: 'books-module' };

module.exports = {
    module: bookModule,
    options: {
        select: ['API'],
        routes: { prefix: '/api/books' }
    }
};
