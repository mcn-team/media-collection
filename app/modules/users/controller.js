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

exports.updateUser = (request, reply) => {
    userServices.updateUser(request.params, request.payload, (err, res) => {
        return responseHelper.controllerReply(err, res, reply);
    });
};

exports.getUserOptions = (request, reply) => {
    userServices.findUserOptions(request.auth.credentials, (err, res) => {
        return responseHelper.controllerReply(err, res, reply);
    });
};
