'use strict';

const services = require('./services');
const responseHelper = require('../../utils/response-helper');

exports.getLanguageFile = (request, reply) => {
    services.loadLanguageFile(request.params, (err, res) => {
        responseHelper.controllerReply(err, res, reply);
    });
};
