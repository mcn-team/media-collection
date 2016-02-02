'use strict';

const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../modules/users/model');

const loginScheme = (server, options) => {
    return {
        authenticate: (request, reply) => {
            const token = request.headers['auth-web-token'];
            if (!token) {
                return reply({ message: 'Please log in' }).code(401);
            }

            jwt.verify(token, config.secretJWT, (err, decoded) => {
                if (err) {
                    return reply({ message: 'Token is not valid', error: err }).code(401);
                }

                User.findOne().where({ _id: decoded.user }).exec((err, user) => {
                    if (err) {
                        return reply({ error: err }).code(500);
                    } else if (!user) {
                        return reply({ message: 'user does not exists', error: err }).code(401);
                    }
                    return reply.continue({ credentials: { id: decoded.user } })
                });
            });
        }
    };
};

module.exports = (server) => {
    server.auth.scheme('ValidationLogin', loginScheme);
    server.auth.strategy('RequiresLogin', 'ValidationLogin');
};
