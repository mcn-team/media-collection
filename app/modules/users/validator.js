'use strict';

const Joi = require('joi');

const questionItem = {
    question: Joi.string().required(),
    answer: Joi.string().required()
};

const recoveryObject = {
    questions: Joi.array().items(questionItem).max(1).required()
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
    language: Joi.string().alphanum().trim().optional()
};

exports.optionsParamsSchema = {
    userId: Joi.string().hex().length(24)
};
