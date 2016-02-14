'use strict';

const userServices = require('./services');
const responseHelper = require('../../utils/response-helper');

exports.signUpUser = (request, reply) => {
    userServices.addUser(request.payload, (err, res) => {
        return responseHelper.controllerReply(err, res, reply);
    });
};

exports.logInUser = (request, reply) => {
    userServices.authenticateUser(request.payload, (err, res) => {
        return responseHelper.controllerReply(err, res, reply);
    });
};
