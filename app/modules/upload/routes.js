'use strict';

const controllers = require('./controllers');

module.exports = (server) => {
    server.route({
        method: 'POST',
        path: '/covers',
        config: {
            auth: 'RequiresLogin',
            payload: {
                maxBytes: 524288
            },
            notes: [
                'Receives a Form Data as payload',
                'Returns a 204 No Content',
                '------------',
                'Payload is : ',
                '{',
                'filename: String,',
                'base64: String',
                '}'
            ],
            description: 'Receives a payload containing the future filename ' +
            'of the cover, which has to be the Mongo ObjectID of the model ' +
            'and the base64 string of the image which has to be a JPEG image.'
        },
        handler: controllers.uploadCover
    });
};
