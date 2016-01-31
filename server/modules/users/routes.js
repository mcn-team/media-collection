'use strict';

const users = require('./controller');

module.exports = (server) => {
    server.route({
        method: 'POST',
        path: '/signup',
        //config: {
        //    pre: [
        //        { method: () => {}, assign: 'userExists' }
        //    ]
        //},
        handler: users.signUpUser
    });
};
