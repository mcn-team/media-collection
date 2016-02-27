'use strict';

const logger = require('../../utils/logger');

const staticFilesModule = {
    register: (server, options, next) => {
        try {
            require('./routes')(server);
            logger.logLoading('Static files');
        } catch (err) {
            logger.logLoading('Static files', true);
            throw err;
        }
        next();
    }
};

staticFilesModule.register.attributes = { name: 'static-files-module' };

exports = module.exports = staticFilesModule;
