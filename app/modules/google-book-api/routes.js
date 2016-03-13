'use strict';

const controller = require('./controller');
const validator = require('./validator');

module.exports = (server) => {
    server.route({
        method: 'GET',
        path: '/isbn/{isbn}',
        config: {
            validate: {
                params: validator.isbnParams
            },
            notes: [
                'Takes an ISBN-13 as parameter',
                'Returns a custom object',
                '{',
                'authors: [ Strings ],',
                'title: String,',
                'author: String,',
                'isbn: String,',
                'publishingDate: String,',
                'publisher: String,',
                'pageCount: Number,',
                'summary: String,',
                'cover: String',
                '}'
            ],
            description: 'Sends back a custom object containing exploitable fields ' +
            'after parsing the Google Book API response. A object with a single key "error" ' +
            'is send back if no match was found in the Google Book API'
        },
        handler: controller.getBookFromGoogle
    });
};
