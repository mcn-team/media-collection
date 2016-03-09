'use strict';

const services = require('./services');
const responseHelper = require('../../utils/response-helper');

exports.getAllLanguages = (request, reply) => {
    services.loadAllFiles((err, res) => {
        responseHelper.controllerReply(err, res, reply);
    });
};
