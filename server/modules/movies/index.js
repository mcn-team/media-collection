'use strict';

const movieModule = {
    register: (server, options, next) => {
        require('./model');
        require('./routes')(server);
        next();
    }
};

movieModule.register.attributes = { name: 'movie-module' };

exports.module = movieModule;
exports.options = {
    select: ['API'],
    routes: { prefix: '/movies' }
};
