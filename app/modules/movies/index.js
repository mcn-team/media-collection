'use strict';

const logger = require('../../utils/logger');

const movieModule = {
    register: (server, options, next) => {
        try {
            require('./model');
            require('./routes')(server);
            logger.logLoading('Movies');
        } catch (err) {
            logger.logLoading('Movies', true, () => {
                throw err;
            });
        }
        next();
    }
};

movieModule.register.attributes = { name: 'movie-module' };

exports = module.exports = movieModule;
