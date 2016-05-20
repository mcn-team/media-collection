'use strict';

const controller = require('./controller');
const validator = require('./validator');

module.exports = (server) => {
    server.route({
        method: 'GET',
        path: '/type/{type}/name/{name}',
        config: {
            auth: 'RequiresLogin',
            validate: { params: validator.searchParams },
            notes: [
                'Takes media type as parameter',
                'Takes search keywords as parameter (name)',
                'Returns an object from Allocine'
            ],
            description: 'Calls Allocine API and sends back all matchings media ' +
            'filtered by "type" criteria and "name" keywords.',
            response: {
                failAction: "log",
                schema: validator.searchResponse
            }
        },
        handler: controller.searchByName
    });

    server.route({
        method: 'GET',
        path: '/type/{type}/id/{id}',
        config: {
            auth: 'RequiresLogin',
            validate: { params: validator.idParams },
            notes: [
                'Takes media type as parameter',
                'Takes Allocine media ID as parameter',
                'Returns an object from Allocine'
            ],
            description: 'Calls Allocine API and sends back all informations ' +
            'about the media specified ID.',
            response: {
                failAction: "log",
                schema: validator.searchByIdResponse
            }
        },
        handler: controller.findById
    });
};
