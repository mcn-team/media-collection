'use strict';

const controllers = require('./controllers');

module.exports = (server) => {
    server.route({
        method: 'GET',
        path: '/',
        config: {
            notes: [
                'Returns an Object',
                '{',
                'en: Object,',
                '\<lang\>: Object,',
                '...',
                '}'
            ],
            description: 'Sends back an Object containing keys corresponding to the ' +
            'available languages translations files. Values of each keys are an Object ' +
            'containing all String translated in the given language.'
        },
        handler: controllers.getAllLanguages
    });
};
