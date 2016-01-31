'use strict';

const User = require('mongoose').model('User');

exports.addUser = (payload, callback) => {
    let newUser = new User(payload);
    newUser.save((err, user) => {
        if (err) {
            callback(err);
        } else {
            callback(null, newUser);
        }
    });
};
