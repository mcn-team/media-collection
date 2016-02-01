'use strict';

const User = require('mongoose').model('User');

exports.addUser = (payload, callback) => {
    let newUser = new User(payload);
    newUser.save((err, user) => {
        if (err) {
            callback({ error: err, code: 503 });
        } else {
            callback(null, { data: newUser, code: 201 });
        }
    });
};

exports.authenticateUser = (payload, callback) => {
    User.findOne({ username: payload.username }).exec((err, user) => {
        if (err) {
            callback({ error: err, code: 503 });
        } else if (!user) {
            callback({ error: 'Wrong username', code: 404 });
        } else {
            if (user.password !== payload.password) {
                callback({ error: 'Wrong password', code: 401 });
            } else {
                callback(null, { message: 'OK', code: 200 });
            }
        }
    });
};
