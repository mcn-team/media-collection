'use strict';

const tvShowModule = {
    register: (server, options, next) => {
        require('./model');
        require('./routes')(server);

        next();
    }
};

tvShowModule.register.attributes = { name: 'tvshow-module' };

exports.module = tvShowModule;
exports.options = {
    select: ['API'],
    routes: { prefix: '/api/tvshows' }
};
