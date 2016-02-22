'use strict';

const path = require('path');

const staticFilesModule = {
    register: (server, options, next) => {
        require('./routes')(server);

        next();
    }
};

staticFilesModule.register.attributes = { name: 'static-files-module' };

exports.module = staticFilesModule;
