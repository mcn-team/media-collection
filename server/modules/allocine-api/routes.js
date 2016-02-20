'use strict';

const controller = require('./controller');
const validator = require('./validator');

module.exports = (server) => {
    server.route({
        method: 'GET',
        path: '/type/{type}/name/{name}',
        config: {
            auth: 'RequiresLogin',
            validate: { params: validator.searchParams }
        },
        handler: controller.searchByName
    });
};
