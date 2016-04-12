'use strict';

const jwt = require('jsonwebtoken');
const _ = require('lodash');
const User = require('mongoose').model('User');

const config = require('../../config');
const responseHelper = require('../../utils/response-helper');

exports.addUser = (payload, callback) => {
    let newUser = new User(payload);
    newUser.save((err, user) => {
        if (err) {
            callback({ error: err, code: 503 });
        } else {
            const token = jwt.sign({ user: user._id }, config.secretJWT);
            user.password = undefined;
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
            if (user.password !== payload.password) {
                callback({ error: 'Wrong password', code: 401 });
            } else {
                const token = jwt.sign({ user: user._id }, config.secretJWT);
                user.password = undefined;
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
