'use strict';

const controllers = require('./controllers');
const validator = require('./validator');

module.exports = (server) => {
    server.route({
        method: 'GET',
        path: '/{lang}',
        config: {
            validate: { params: validator.langParams }
        },
        handler: controllers.getLanguageFile
    });
};
