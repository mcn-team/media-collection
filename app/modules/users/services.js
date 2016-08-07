'use strict';

const jwt = require('jsonwebtoken');
const _ = require('lodash');
const User = require('mongoose').model('User');

const config = require('../../config');
const responseHelper = require('../../utils/response-helper');
const cypher = require('../auth/auth.services');

const recoveryResponseOptions = {
    new: true,
    fields: {
        username: false,
        password: false,
        displayName: false,
        email: false,
        admin: false,
        options: false,
        created: false,
        _id: false,
        'recovery.questions.answer': false
    }
};

const authenticateResponse = (code, user, callback) => {
    const token = jwt.sign({ user: user._id }, config.secretJWT);
    delete user.password;
    user.recovery = !!(user.recovery &&
        ((user.recovery.medias && user.recovery.medias.length > 0) ||
        (user.recovery.questions && user.recovery.questions.length > 0)));
    callback(null, { data: { token: token, user: user }, code: code });
};

const errorObject = (message) => {
    return { message: message }
};

exports.addUser = (payload, callback) => {
    payload.password = cypher.decrypt(payload.password);
    let newUser = new User(payload);

    newUser.save((err, user) => {
        if (err) {
            callback({ error: err, code: 503 });
        } else {
            authenticateResponse(201, user, callback);
        }
    });
};

exports.authenticateUser = (payload, callback) => {
    User.findOne({ username: payload.username }).lean().exec((err, user) => {
        if (err) {
            callback({ error: err, code: 503 });
        } else if (!user) {
            callback({ error: errorObject('Wrong username'), code: 401 });
        } else {
            if (user.password !== cypher.decrypt(payload.password)) {
                callback({ error: errorObject('Wrong password'), code: 401 });
            } else {
                authenticateResponse(200, user, callback);
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
            callback({ error: errorObject('Username already exists'), code: 409 });
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
        return callback({ error: errorObject('Please log in'), code: 401 });
    }

    jwt.verify(token, config.secretJWT, (err, decoded) => {
        if (err) {
            return callback({ error: errorObject('Token is not valid'), code: 401 });
        }

        User.findOne({ _id: decoded.user }).exec((err, user) => {
            if (err) {
                error = { error: err, code: 503 };
            } else if (!user) {
                error = { error: errorObject('User does not exists'), code: 401 };
            } else if (user && !user._doc.admin) {
                error = { error: errorObject('You are not administrator'), code: 403 };
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

const generateTimeLimitedToken = (id) => {
    return jwt.sign({ user: id }, config.secretJWT, { expiresIn: '30m', jwtid: 'recovery' });
};

exports.validateRecoveryAnswer = (params, payload, callback) => {
    const Book = require('../books/services');

    User.findOne({ _id: params.userId }).lean().exec((err, user) => {
        if (err) {
            return callback({ error: err, code: 503 }, null);
        } else if (!user) {
            return callback({ error: errorObject('User does not exists'), code: 401 }, null);
        } else {
            let selectedQuestion = null;

            if (user.recovery.method === 'questions') {
                selectedQuestion = _.filter(user.recovery[user.recovery.method], { question: payload.question });

                if (selectedQuestion.length > 0 && selectedQuestion[0].answer === cypher.decrypt(payload.answer)) {
                    return callback(null, { data: { token: generateTimeLimitedToken(user._id) }, code: 200 });
                } else {
                    return callback({ error: errorObject('The answer is incorrect'), code: 403 }, null);
                }
            } else {
                for (let i = 0; i < user.recovery.medias.length; i++) {
                    if (user.recovery.medias[i].mediaId.toString() === payload.mediaId) {
                        selectedQuestion = user.recovery.medias[i];
                    }
                }

                if (selectedQuestion && selectedQuestion.mediaId) {
                    Book.findOneBook({ bookId: selectedQuestion.mediaId }, (err, book) => {
                        if (err) {
                            return callback({ error: err, code: 503 }, null);
                        } else if (!book) {
                            return callback({ error: errorObject('The media does not exist'), code: 404 }, null);
                        } else {
                            if (book.data[payload.fields].toLowerCase() === payload.answer.toLowerCase()) {
                                return callback(null, { data: { token: generateTimeLimitedToken(user._id) }, code: 200 });
                            } else {
                                return callback({ error: errorObject('The answer is incorrect'), code: 403 }, null);
                            }
                        }
                    });
                } else {
                    return callback({ error: errorObject('The answer is incorrect'), code: 403 }, null);
                }
            }
        }
    });
};

exports.saveUserPassword = (params, payload, callback) => {
    User.findOneAndUpdate({ _id: params.userId }, { $set: { password: payload.password } }, { new: true }).lean().exec((err, response) => {
        return authenticateResponse(200, response, callback);
    });
};

exports.decipherPassword = (payload, callback) => {
    return callback(null, cypher.decrypt(payload.password));
};

const findRecoveryList = (params, callback, stripMethod) => {
    const query = {};
    if (params.userId) {
        query._id = params.userId;
    } else if (params.username) {
        query.username = params.username;
    }

    User.findOne(query, {
        username: false,
        password: false,
        displayName: false,
        email: false,
        admin: false,
        options: false,
        created: false,
        'recovery.questions.answer': false
    }).lean().exec((err, user) => {
        if (err) {
            return callback({ error: err, code: 503 });
        } else if (!user) {
            return callback({ error: errorObject('This username does not exist'), code: 400 });
        } else {
            if (stripMethod) {
                if (user.recovery.method === "media") {
                    delete user.recovery.questions;
                } else {
                    delete user.recovery.medias;
                }
            }

            return callback(null, { data: user, code: 200 });
        }
    });
};

exports.findRecoveryList = findRecoveryList;

const buildUpdateObject = (payload, update, checking, field) => {
    if (payload[checking]) {
        update.$push = {};
        update.$push[field] = payload;
    } else {
        update.$pull = {};
        update.$pull[field] = payload;
    }

    return update;
};

exports.updateRecoveryList = (params, payload, callback) => {
    findRecoveryList(params, (err, res) => {
        let update = {};
        let field = 'recovery.';

        if (payload.question) {
            field += 'questions';
            payload.answer = cypher.decrypt(payload.answer);
            buildUpdateObject(payload, update, 'answer', field);
        } else if (payload.mediaId) {
            field +='medias';
            buildUpdateObject(payload, update, 'field', field);
        }

        User.findOneAndUpdate({ _id: params.userId }, update, recoveryResponseOptions).exec((err, response) => {
            return responseHelper.serviceCallback(err, response, 200, callback);
        });
    });
};

exports.findOneRecovery = (params, payload, callback) => {
    if (!payload.answer && !payload.field) {
        return callback()
    }

    let options = {};

    if (payload.question) {
        options.field = 'question';
        options.search = 'recovery.questions';
        options.content = payload.question;
    } else {
        options.field = 'mediaId';
        options.search = 'recovery.medias';
        options.content = payload.mediaId;
    }

    let query = {
        _id: params.userId
    };

    query[options.search] = { $elemMatch: {} };
    query[options.search].$elemMatch[options.field] = options.content;

    User.find(query).lean().exec((err, res) => {
        return callback(err, res);
    });
};

exports.updateOneRecovery = (params, payload, callback) => {
    const key = payload.key;
    delete payload.key;

    const query = { _id: params.userId, 'recovery.questions.question': key };
    const updater = { $set: { 'recovery.questions.$': payload } };

    User.findOneAndUpdate(query, updater, recoveryResponseOptions).lean().exec((err, response) => {
        return responseHelper.serviceCallback(err, response, 200, callback);
    });
};
