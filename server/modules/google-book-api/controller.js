'use strict';

const services = require('./services');
const responseHelper = require('../../utils/response-helper');

exports.getBookFromGoogle = (request, reply) => {
    services.findBookByIsbn(request.params, (err, res) => {
        return responseHelper.controllerReply(err, res, reply);
    });
};
