'use strict';

const services = require('./auth.services');
const responseHelper = require('../../utils/response-helper');

exports.getPublicKey = (request, reply) => {
    services.retrievePublicKey((err, res) => {
        responseHelper.controllerReply(err, res, reply);
    });
};
