'use strict';

const controllers = require('./controllers');
const validator = require('./validator');

module.exports = (server) => {
    server.route({
        method: 'POST',
        path: '/cover/{mediaId}',
        config: {
            validate: {
                params: validator.uploadParams
            },
            payload: {
                maxBytes: 5242880,
                output: 'stream',
                parse: true,
                allow: 'multipart/form-data'
            }
        },
        handler: controllers.uploadCover
    });
};
