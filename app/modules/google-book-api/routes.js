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
            }
        },
        handler: controller.getBookFromGoogle
    });
};
