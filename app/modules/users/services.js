'use strict';

const jwt = require('jsonwebtoken');
const _ = require('lodash');
const User = require('mongoose').model('User');

const config = require('../../config');
const responseHelper = require('../../utils/response-helper');
const cypher = require('../auth/auth.services');

exports.addUser = (payload, callback) => {
    payload.password = cypher.decrypt(payload.password);
    let newUser = new User(payload);

    newUser.save((err, user) => {
        if (err) {
            callback({ error: err, code: 503 });
        } else {
            const token = jwt.sign({ user: user._id }, config.secretJWT);
            user.password = undefined;
            user.recovery = undefined;
            callback(null, { data: { token: token, user: user }, code: 201 });
        }
    });
};

exports.authenticateUser = (payload, callback) => {
    User.findOne({ username: payload.username }).exec((err, user) => {
        if (err) {
            callback({ error: err, code: 503 });
        } else if (!user) {
            callback({ error: 'Wrong username', code: 401 });
        } else {
            if (user.password !== cypher.decrypt(payload.password)) {
                callback({ error: 'Wrong password', code: 401 });
            } else {
                const token = jwt.sign({ user: user._id }, config.secretJWT);
                user.password = undefined;
                user.recovery = undefined;
                callback(null, { data: { token: token, user: user }, code: 200 });
            }
        }
    });
};

exports.updateUser = (params, payload, callback) => {
    User.findOneAndUpdate({ _id: params.userId }, payload).exec((err, user) => {
        responseHelper.serviceCallback(err, _.merge(user, payload), 200, callback);
    });
};

exports.findUserOptions = (user, callback) => {
    User.find({ _id: user.id }, { _id: false, options: true }).exec((err, options) => {
        responseHelper.serviceCallback(err, options, 200, callback);
    });
};

exports.findUsers = (callback) => {
    User.find({}, { password: false, options: false, recovery: false }).exec((err, users) => {
        responseHelper.serviceCallback(err, users, 200, callback);
    });
};

exports.findIfUser = (callback) => {
    User.count({}, (err, count) => {
        if (!err) {
            if (count == 0) {
                count = {exists: false};
            } else {
                count = {exists: true};
            }
        }

        return responseHelper.serviceCallback(err, count, 200, callback)
    });
};

exports.findUserByUsername = (payload, callback) => {
    User.find({ username: payload.username }).exec((err, users) => {
        if (err) {
            callback({ error: err, code: 503 });
        } else if (users && users.length > 0) {
            callback({ error: 'Username already exists', code: 409 });
        } else {
            callback(null);
        }
    });
};

exports.removeUser = (params, callback) => {
    User.findOneAndRemove({ _id: params.userId }).exec((err, user) => {
        responseHelper.serviceCallback(err, user, 200, callback);
    });
};

exports.updateUserOptions = (params, payload, callback) => {
    User.findOneAndUpdate({ _id: params.userId }, { $set: { 'options': payload } }).exec((err, response) => {
        return responseHelper.serviceCallback(err, response, 204, callback);
    });
};

exports.checkAdminStatus = (headers, callback) => {
    const token = headers['auth-web-token'];
    let error = null;

    if (!token) {
        return callback({ error: 'Please log in', code: 401 });
    }

    jwt.verify(token, config.secretJWT, (err, decoded) => {
        if (err) {
            return callback({ error: 'Token is not valid', code: 401 });
        }

        User.findOne({ _id: decoded.user }).exec((err, user) => {
            if (err) {
                error = { error: err, code: 503 };
            } else if (!user) {
                error = { error: 'User does not exists', code: 401 };
            } else if (user && !user._doc.admin) {
                error = { error: 'You are not administrator', code: 403 };
            }

            return callback(error, null);
        });
    });
};

exports.findOneUser = (userId, callback) => {
    let error = null;
    let response = null;
    
    User.findOne({ _id: userId }).exec((err, user) => {
        if (err) {
            error = { error: err, code: 503 };
        } else if (!user) {
            error = { error: 'User does not exists', code: 401 };
        } else {
            response = { data: user, code: 200 };
        }
        
        return callback(error, response);
    });
};

exports.findRecoveryFromUser = (params, callback) => {
    User.findOne({ _id: params.userId }, {
        username: false,
        password: false,
        displayName: false,
        email: false,
        admin: false,
        options: false,
        created: false,
        _id: false,
        'recovery.questions.answer': false,
        'recovery.medias.mediaId': false
    }).lean().exec((err, users) => {
        if (users.recovery.method === "questions") {
            delete users.recovery.medias;
        } else {
            delete users.recovery.questions;
        }

        return responseHelper.serviceCallback(err, users, 200, callback);
    });
};
