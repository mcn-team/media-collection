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
            }
        },
        handler: controllers.uploadCover
    });
};
