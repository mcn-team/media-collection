'use strict';

const jwt = require('jsonwebtoken');

const User = require('../users/model').model;
const config = require('../../config');

exports = module.exports = (server, options) => {
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

                User.findOne({ _id: decoded.user }).exec((err, user) => {
                    if (err) {
                        return reply({ error: err }).code(503);
                    } else if (!user) {
                        return reply({ message: 'user does not exists', error: err }).code(401);
                    } else if (options && options.admin && user && !user._doc.admin) {
                        return reply({ message: 'You are not administrator' }).code(403);
                    }

                    return reply.continue({ credentials: { id: decoded.user } })
                });
            });
        }
    };
};
