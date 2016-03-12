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
            notes: 'Returns an array of objects from Allocine',
            description: 'Calls Allocine API and sends back all matchings media ' +
            'filtered by "type" criteria and "name" keywords'
        },
        handler: controller.searchByName
    });

    server.route({
        method: 'GET',
        path: '/type/{type}/id/{id}',
        config: {
            auth: 'RequiresLogin',
            validate: { params: validator.idParams },
            notes: 'Returns an object from Allocine',
            description: 'Calls Allocine API and sends back all information ' +
            'about the media specified id'
        },
        handler: controller.findById
    });
};
