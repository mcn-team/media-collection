'use strict';

const users = require('./controller');
const validator = require('./validator');

module.exports = (server) => {
    server.route({
        method: 'POST',
        path: '/signup',
        config: {
            validate: {
                payload: validator.signUpPayload
            }
        },
        handler: users.signUpUser
    });

    server.route({
        method: 'POST',
        path: '/login',
        config: {
            validate: {
                payload: validator.logInPayload
            }
        },
        handler: users.logInUser
    });

    server.route({
        method: 'PATCH',
        path: '/{userId}',
        config: {
            auth: 'RequiresLogin',
            validate: {
                params: validator.userIdParams,
                payload: validator.updatePayload
            }
        },
        handler: users.updateUser
    });
};
