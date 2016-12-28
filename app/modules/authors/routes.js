'use strict';

const controllers = require('./controllers');

module.exports = (server) => {
    server.route({
        method: 'GET',
        path: '/',
        config: {
            auth: 'RequiresLogin',
            validate: {},
            notes: [
                'Returns an array of Authors model'
            ],
            description: 'Sends back the full list of authors registered in the database.'
        },
        handler: controllers.compileAuthorsList
    });
};
