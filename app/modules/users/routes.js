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
            },
            notes: [
                'Takes a User object as payload',
                'Returns an Object',
                '{',
                'token: String',
                'user: Object',
                '}'
            ],
            description: 'Adds a new user in the database and sends back ' +
            'an Object containing the web token for this user authentication ' +
            'and the User Model newly added without sentitive fields.'
        },
        handler: users.signUpUser
    });

    server.route({
        method: 'POST',
        path: '/login',
        config: {
            validate: {
                payload: validator.logInPayload
            },
            notes: [
                'Takes a User object as payload',
                'Returns an Object',
                '{',
                'token: String',
                'user: Object',
                '}'
            ],
            description: 'Sends back an Object containing the web token for this ' +
            'user authentication and the User Model newly added without sentitive fields.'
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
            },
            notes: [
                'Takes a User object as payload',
                'Returns the edited User Model'
            ],
            description: 'Edit the user document in the database corresponding to ' +
            'the ID parameter and sends back the corresponding User model without ' +
            'sentitive fields. User model can be partially edited by passing an object ' +
            'containing only the fields to update.'
        },
        handler: users.updateUser
    });

    server.route({
        method: 'GET',
        path: '/options',
        config: {
            auth: 'RequiresLogin',
            notes: 'Returns an Array of Object',
            description: 'Sends back the options field of the authentified user.'
        },
        handler: users.getUserOptions
    });
};
