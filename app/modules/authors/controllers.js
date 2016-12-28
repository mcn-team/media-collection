'use strict';

const responseHelper = require('../../utils/response-helper');
const services = require('./services');

exports.compileAuthorsList = (request, reply) => {
    services.compileAuthorsList((err, res) => {
        return responseHelper.controllerReply(err, res, reply);
    });
};
