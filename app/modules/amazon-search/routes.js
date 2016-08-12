'use strict';

const validators = require('./validators');
const controllers = require('./controllers');

module.exports = (server) => {
    server.route({
        method: 'GET',
        path: '/{isbn}',
        config: {
            validate: { params: validators.isbnParamsSchema },
            notes: [
                'Requires an user\'s token',
                'Takes an ISBN number as parameters',
                'Returns a 200 OK and an Object'
            ],
            description: 'Takes an ISBN as parameter to search its data on Amazon.' +
            'Sends back an HTTP 200 OK and an Object containing the data registered on ' +
            'Amazon website related to this book.'
        },
        handler: controllers.getDataByISBN
    });
};
