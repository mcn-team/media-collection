'use strict';

const bookModule = {
    register: (server, options, next) => {
        require('./model');
        require('./routes')(server);
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
