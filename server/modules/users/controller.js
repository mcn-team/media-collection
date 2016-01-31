'use strict';

const userServices = require('./services');
const logger = require('../../utils/logger');

exports.signUpUser = (request, reply) => {
    userServices.addUser(request.payload, (err, res) => {
        if (err) {
            logger.logRoute(500, 'POST', request.path);
            return reply(err).code(500);
        } else {
            logger.logRoute(201, 'POST', request.path);
            return reply(res).code(201);
        }
    });
};
