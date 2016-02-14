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
            }
        },
        handler: controller.searchByTitle
    });

    server.route({
        method: 'GET',
        path: '/type/{type}/id/{id}',
        config: {
            validate: {
                params: validator.idParams
            }
        },
        handler: controller.searchById
    });
};
