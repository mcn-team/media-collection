'use strict';

const userServices = require('./services');
const logger = require('../../utils/logger');

exports.signUpUser = (request, reply) => {
    userServices.addUser(request.payload, (err, res) => {
        if (err) {
            return reply(err.error).code(err.code);
        } else {
            return reply(res).code(res.code);
        }
    });
};

exports.logInUser = (request, reply) => {
    userServices.authenticateUser(request.payload, (err, res) => {
        if (err) {
            return reply(err.error).code(err.code);
        } else {
            return reply(res).code(res.code);
        }
    });
};
