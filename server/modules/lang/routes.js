'use strict';

const controllers = require('./controllers');
const validator = require('./validator');

module.exports = (server) => {
    server.route({
        method: 'GET',
        path: '/',
        config: {
            validate: { query: validator.langQuery }
        },
        handler: controllers.getLanguageFile
    });
};
