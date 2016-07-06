'use strict';

const userServices = require('./services');
const responseHelper = require('../../utils/response-helper');

exports.signUpUser = (request, reply) => {
    if (request.pre.userExists) {
        return reply(request.pre.userExists.error).code(request.pre.userExists.code);
    } else if (request.pre.hasUsers && request.pre.isNotAdmin) {
        return reply(request.pre.isNotAdmin.error).code(request.pre.isNotAdmin.code);
    } else {
        if (!request.pre.hasUsers) {
            request.payload.admin = true;
        }

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

exports.checkIfUser = (request, reply) => {
    userServices.findIfUser((err, res) => {
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

exports.ifUsers = (request, reply) => {
    userServices.findIfUser((err, res) => {
        if (err) {
            return reply(err);
        } else {
            return reply(res.data.exists)
        }
    });
};

exports.ifAdmin = (request, reply) => {
    if (!request.pre.hasUsers) {
        return reply(null);
    }

    userServices.checkAdminStatus(request.headers, (err, res) => {
        let response = null;

        if (err) {
            response = err;
        } else {
            response = res;
        }

        return reply(response);
    });
};

exports.getRecoveryFields = (request, reply) => {
    userServices.findRecoveryList(request.params, (err, res) => {
        return responseHelper.controllerReply(err, res, reply);
    }, true);
};

exports.checkRecoveryAnswer = (request, reply) => {
    userServices.validateRecoveryAnswer(request.params, request.payload, (err, res) => {
        return responseHelper.controllerReply(err, res, reply);
    });
};

exports.updateUserPassword = (request, reply) => {
    //TODO: encryption features deactivated for testing purposes
    // if (!request.pre.decrypted) {
    //     return reply({ error: 'password-decryption-error' }).code(503);
    // }

    userServices.saveUserPassword(request.params, request.payload, (err, res) => {
        return responseHelper.controllerReply(err, res, reply);
    });
};

exports.decryptPassword = (request, reply) => {
    userServices.decipherPassword(request.payload, (err, res) => {
        if (err) {
            return reply(err).code(500);
        } else {
            return reply(res.data);
        }
    });
};

exports.getRecoveryList = (request, reply) => {
    userServices.findRecoveryList(request.params, (err, res) => {
        responseHelper.controllerReply(err, res, reply);
    });
};

exports.patchRecoveryList = (request, reply) => {
    userServices.updateRecoveryList(request.params, request.payload, (err, res) => {
        responseHelper.controllerReply(err, res, reply);
    });
};
