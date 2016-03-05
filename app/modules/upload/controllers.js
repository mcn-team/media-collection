'use strict';

const services = require('./services');
const responseHekper = require('../../utils/response-helper');

exports.uploadCover = (request, reply) => {
    services.storeCover(request.payload, request.params, (err, res) => {
        responseHekper.controllerReply(err, res, reply);
    });
};
