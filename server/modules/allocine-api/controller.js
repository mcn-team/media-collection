'use strict';

const services = require('./services');
const responseHelper = require('../../utils/response-helper');

exports.searchByName = (request, reply) => {
    services.searchByName(request.params, (err, res) => {
        responseHelper.controllerReply(err, res, reply);
    });
};
