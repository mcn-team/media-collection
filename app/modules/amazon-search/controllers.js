'use strict';

const services = require('./services');
const responseHelper = require('../../utils/response-helper');

exports.getDataByISBN = (request, reply) => {
    services.searchByIsbn(request.params, (err, response) => {
        responseHelper.controllerReply(err, response, reply);
    })
};
