'use strict';

const userServices = require('./services');
const logger = require('../../utils/logger');

exports.signUpUser = (request, reply) => {
    userServices.addUser(request.payload, (err, res) => {
        if (err) {
            logger.logRoute(err.code, 'POST', request.path);
            return reply(err.error).code(err.code);
        } else {
            logger.logRoute(res.code, 'POST', request.path);
            return reply(res).code(res.code);
        }
    });
};

exports.logInUser = (request, reply) => {
    userServices.authenticateUser(request.payload, (err, res) => {
        if (err) {
            logger.logRoute(err.code, 'POST', request.path);
            return reply(err.error).code(err.code);
        } else {
            logger.logRoute(res.code, 'POST', request.path);
            return reply(res).code(res.code);
        }
    });
};
