'use strict';

const users = require('./controller');
const validator = require('./validator');

module.exports = (server) => {
    server.route({
        method: 'POST',
        path: '/signup',
        config: {
            pre: [
                { method: users.ifUsers, assign: 'hasUsers' },
                { method: users.ifAdmin, assign: 'isNotAdmin' },
                { method: users.ifUsernameExists, assign: 'userExists' }
            ],
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
            'and the User Model newly added without sensitive fields.'
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
            'user authentication and the User Model newly added without sensitive fields.'
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
            'sensitive fields. User model can be partially edited by passing an object ' +
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
            description: 'Sends back the options field of the authenticated user.'
        },
        handler: users.getUserOptions
    });

    server.route({
        method: 'GET',
        path: '/',
        config: {
            auth: 'RequiresAdmin',
            notes: 'Returns an Array of Object',
            description: 'Sends back the list of registered users without their ' +
            'passwords or their options'
        },
        handler: users.getUserList
    });

    server.route({
        method: 'DELETE',
        path: '/{userId}',
        config: {
            auth: 'RequiresAdmin',
            notes: 'Returns an User Object',
            description: 'Removes the user with the specified MongoDB ObjectID ' +
            'passed as parameters from the database.'
        },
        handler: users.deleteUser
    });

    server.route({
        method: 'PATCH',
        path: '/{userId}/options',
        config: {
            auth: 'RequiresLogin',
            validate: {
                params: validator.optionsParamsSchema,
                payload: validator.optionsPayloadSchema
            },
            notes: [
                'Takes an user\'s Mongo ID as parameters',
                'Takes an Object as payload',
                'Returns HTTP 204 No Content on success'
            ],
            description: 'Update the options key value of the specified users'
        },
        handler: users.saveUserOptions
    });

    server.route({
        method: 'GET',
        path: '/count',
        config: {
            notes: 'Returns an Array of Object',
            description: 'Sends back the options field of the authenticated user.'
        },
        handler: users.checkIfUser
    });

    server.route({
        method: 'GET',
        path: '/test/{userId}',
        config: {
            auth: 'RequiresLoginStrict'
        },
        handler: (request, reply) => {
            return reply('Yolo').code(200);
        }
    });
};
