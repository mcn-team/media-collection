'use strict';

const services = require('./services');
const responseHelper = require('../../utils/response-helper');

exports.searchByTitle = (request, reply) => {
    services.findByTitle(request.params, (err, res) => {
        return responseHelper.controllerReply(err, res, reply);
    });
};

exports.searchById = (request, reply) => {
    services.findById(request.params, (err, res) => {
        return responseHelper.controllerReply(err, res, reply);
    });
};
