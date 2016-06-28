'use strict';

const jwt = require('jsonwebtoken');

const userService = require('../users/services');
const config = require('../../config');

exports = module.exports = (server, options) => {
    return {
        authenticate: (request, reply) => {
            const token = request.headers['auth-web-token'];

            if (!token) {
                return reply({ message: 'Please log in' }).code(401);
            }

            jwt.verify(token, config.secretJWT, { jwtid: 'recovery' }, (err, decoded) => {
                if (err) {
                    return reply({ message: 'Token is not valid', error: err }).code(401);
                }

                userService.findOneUser(decoded.user, (err, response) => {
                    if (err) {
                        return reply({ error: err.error }).code(err.code);
                    } else {
                        if (response.data._id.toString() !== request.params.userId) {
                            return reply({ message: 'You are not allowed to update this user' }).code(403);
                        } else {
                            return reply.continue({ credentials: { id: decoded.user } });
                        }
                    }
                });
            });
        }
    };
};
