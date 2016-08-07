'use strict';

const Joi = require('joi');
const _ = require('lodash');

const questionItem = {
    question: Joi.string().required(),
    answer: Joi.string().required()
};

const mediaItem = {
    mediaId: Joi.string().hex().length(24).required(),
    fields: Joi.string().required()
};

const recoveryObject = {
    questions: Joi.array().items(questionItem).max(1).required()
};

const oldValue = {
    key: Joi.string().required()
};


exports.signUpPayload = {
    username: Joi.string().alphanum().trim().required(),
    password: Joi.string().required(),
    displayName: Joi.string().trim().required(),
    email: Joi.string().email().trim().required(),
    recovery: recoveryObject
};

exports.logInPayload = {
    username: Joi.string().alphanum().trim().required(),
    password: Joi.string().required()
};

exports.userIdParams = {
    userId: Joi.string().hex().length(24)
};

exports.updatePayload = {
    username: Joi.string().alphanum().trim(),
    displayName: Joi.string().trim(),
    email: Joi.string().email().trim()
};

exports.optionsPayloadSchema = {
    language: Joi.string().alphanum().trim().optional(),
    feedInterval: Joi.number().integer().positive().optional()
};

exports.recoveryPayload = {
    question: Joi.string().optional(),
    answer: Joi.string().optional(),
    media: Joi.string().hex().length(24).optional(),
    field: Joi.string().optional()
};

exports.questionsEditPayload = _.merge({}, oldValue, questionItem);

exports.mediasEditPayload = _.merge({}, oldValue, mediaItem);

exports.usernameParams = { username: Joi.string().alphanum().trim().required() };

exports.resetPayload = { password: Joi.string().required() };
