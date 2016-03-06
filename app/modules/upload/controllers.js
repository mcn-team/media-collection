'use strict';

const services = require('./services');
const responseHelper = require('../../utils/response-helper');

exports.uploadCover = (request, reply) => {
    services.storeCover(request.payload, (err, res) => {
        responseHelper.controllerReply(err, res, reply);
    });
};
