'use strict';

const fs = require('fs');
const path = require('path');

const logger = require('../../utils/logger');
const config = require('../../config');

const uploadModule = {
    register: (server, options, next) => {
        try {
            fs.statSync(path.join(config.projectRoot, config.coverDirectory)).isDirectory();
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
