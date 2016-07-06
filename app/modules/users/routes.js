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
                params: validator.userIdParams,
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
        path: '/{userId}/forgot',
        config: {
            validate: {
                params: validator.userIdParams
            },
            notes: [
                'Takes an user\'s Mongo ID as parameters',
                'Returns HTTP 200 Ok and an object on success'
            ],
            description: 'Sends back an object containing the password recovery ' +
            'method of the specified user and an array containing the questions (or fields) ' +
            'required to authenticate himself depending on the method.'
        },
        handler: users.getRecoveryFields
    });

    server.route({
        method: 'POST',
        path: '/{userId}/forgot',
        config: {
            validate: {
                params: validator.userIdParams
            },
            notes: [
                'Takes an user\'s Mongo ID as parameters',
                'Takes the selected question and the answer as payload',
                'Returns HTTP 200 Ok and an object on success',
                'Returns HTTP 401 Unauthorized and an object on error'
            ],
            description: 'Takes the selected question and answer, checks it by getting ' +
            'correct answer from the database and sends back an time limited token if the ' +
            'the answer is correct or 401 Unauthorized if not.'
        },
        handler: users.checkRecoveryAnswer
    });

    server.route({
        method: 'PATCH',
        path: '/{userId}/forgot',
        config: {
            auth: 'RequiresRecovery',
            validate: {
                params: validator.userIdParams
            },
            notes: [
                'Takes an user\'s Mongo ID as parameters',
                'Takes the new password as payload',
                'Returns HTTP 200 Ok and an object on success',
                'Returns HTTP 401 Unauthorized and an object on error'
            ],
            description: 'Takes the new password hashed and ciphered as payload and ' +
            'update the user model by replacing the current password with the new one.'
            //TODO: encryption features deactivated for testing purposes
            // pre: [
            //     { method: users.decryptPassword, assign: 'decrypted' }
            // ]
        },
        handler: users.updateUserPassword
    });

    server.route({
        method: 'GET',
        path: '/{userId}/recovery',
        config: {
            auth: 'RequiresLoginStrict',
            validate: {
                params: validator.userIdParams
            },
            notes: [
                'Takes an user\'s Mongo ID as parameters',
                'Returns HTTP 200 Ok and an object on success',
                'Returns HTTP 401 Unauthorized and an object on error'
            ],
            description: 'Sends back an Array containing the list of secret questions ' +
            'or medias depending on the type parameter.'
        },
        handler: users.getRecoveryList
    });

    server.route({
        method: 'PATCH',
        path: '/{userId}/recovery',
        config: {
            auth: 'RequiresLoginStrict',
            validate: {
                params: validator.userIdParams,
                payload: validator.recoveryPayload
            },
            notes: [
                'Takes an user\'s Mongo ID as parameters',
                'Takes an Object as payload',
                'Returns HTTP 200 Ok and an object on success',
                'Returns HTTP 401 Unauthorized and an object on error'
            ],
            description: 'Takes an object containing a question or media fields, depending ' +
            'on the recovery field to add/update/delete and an optional field value if the desired ' +
            'action is a add or update. This last field contains the answer if this this a question or ' +
            'the required field asked if it is a media. ' +
            'Sends back the updated recovery object described in the GET recovery route.'
            //TODO: prehandler to check if question or media already exists (if exists return 400)
        },
        handler: users.patchRecoveryList
    });

    //TODO: PATCH .../edit to update an existing media or question
};
