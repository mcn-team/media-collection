'use strict';

const users = require('./controller');

module.exports = (server) => {
    server.route({
        method: 'POST',
        path: '/signup',
        handler: users.signUpUser
    });
    server.route({
        method: 'POST',
        path: '/login',
        handler: users.logInUser
    });
};
