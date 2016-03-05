'use strict';

const logger = require('../../utils/logger');

const uploadModule = {
    register: (server, options, next) => {
        try {
            require('./routes')(server);
            logger.logLoading('Upload');
        } catch (err) {
            logger.logLoading('Upload', true);
            throw err;
        }
        next();
    }
};

uploadModule.register.attributes = { name: 'upload-module' };

exports = module.exports = uploadModule;
