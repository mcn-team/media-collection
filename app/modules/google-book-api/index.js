'use strict';

const logger = require('../../utils/logger');

const googleBookApi = {
    register: (server, options, next) => {
        try {
            require('./routes')(server);
            logger.logLoading('Google Book API');
        } catch (err) {
            logger.logLoading('Google Book API', true, () => {
                throw err;
            });
        }
        next();
    }
};

googleBookApi.register.attributes = { name: 'google-book-api-module' };

exports = module.exports = googleBookApi;
