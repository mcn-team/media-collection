'use strict';

const controller = require('./controller');
const validator = require('./validator');

module.exports = (server) => {
    server.route({
        method: 'GET',
        path: '/title/{title}',
        config: {
            validate: {
                params: validator.titleParams
            },
            notes: [
                'Takes search keywords as parameter (title)',
                'Returns an Array of Object',
                '[{',
                'pageId: String,',
                'pageTitle: String',
                '}]'
            ],
            description: 'Calls Wikipedia API and sends back all matchings pages ' +
            'filtered by "title" keywords.'
        },
        handler: controller.searchByTitle
    });

    server.route({
        method: 'GET',
        path: '/type/{type}/id/{id}',
        config: {
            validate: {
                params: validator.idParams
            },
            notes: [
                'Takes media type as parameter',
                'Takes Wikipedia page ID as parameter',
                'Returns an object from Wikipedia',
                '{',
                'title: [ String ],',
                'authorsList: [ String ],',
                'publisher: [ String ],',
                'collectionName: [ String ],',
                'pageCount: [ String ],',
                'isbn: String',
                '}'
            ],
            description: 'Calls Wikipedia API and sends back all informations ' +
            'about the media specified ID.'
        },
        handler: controller.searchById
    });
};
