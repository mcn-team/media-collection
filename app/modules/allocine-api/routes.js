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
                'Returns an objects from Allocine',
                '{',
                'result: [ Object ],',
                'filter: String',
                '}',
                '------------',
                'result Objects are : ',
                '{',
                'code: Number,',
                'originalTitle: String,',
                'productionYear: Number,',
                'release: Object,',
                'castingShort: Object,',
                'statistics: Object,',
                'poster: Object,',
                'link: [ Object ]',
                '}'
            ],
            description: 'Calls Allocine API and sends back all matchings media ' +
            'filtered by "type" criteria and "name" keywords. The result key of the ' +
            'response object contains '
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
                'Returns an object from Allocine',
                '{',
                'result: Object,',
                'filter: String',
                '}',
                '------------',
                'result Object is : ',
                '{',
                'code: Number,',
                'movieType: Object,',
                'originalTitle: String,',
                'title: String,',
                'productionYear: Number,',
                'genre: [ Object ],',
                'release: Object,',
                'runtime: Number,',
                'synopsis: String,',
                'synopsisShort: String,',
                'castingShort: Object,',
                'castMember: [ Object ],',
                'poster: Object,',
                'trailer: Object,',
                'dvdReleaseDate: String,',
                'media: [ Object ],',
                'statistics: Object',
                '}'
            ],
            description: 'Calls Allocine API and sends back all information ' +
            'about the media specified ID'
        },
        handler: controller.findById
    });
};
