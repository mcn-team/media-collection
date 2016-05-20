'use strict';

const userServices = require('./services');
const responseHelper = require('../../utils/response-helper');

exports.signUpUser = (request, reply) => {
    if (request.pre.userExists) {
        return reply(request.pre.userExists.error).code(request.pre.userExists.code);
    } else {
        userServices.addUser(request.payload, (err, res) => {
            return responseHelper.controllerReply(err, res, reply);
        });
    }
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

exports.getUserList = (request, reply) => {
    userServices.findUsers((err, res) => {
        return responseHelper.controllerReply(err, res, reply);
    });
};

exports.deleteUser = (request, reply) => {
    userServices.removeUser(request.params, (err, res) => {
        return responseHelper.controllerReply(err, res, reply);
    });
};

exports.saveUserOptions = (request, reply) => {
    userServices.updateUserOptions(request.params, request.payload, (err, res) => {
        return responseHelper.controllerReply(err, res, reply);
    });
};

/**
 * users Pre-handlers
 */

exports.ifUsernameExists = (request, reply) => {
    userServices.findUserByUsername(request.payload, (err) => {
        if (err) {
            return reply(err);
        } else {
            return reply(false);
        }
    });
};
