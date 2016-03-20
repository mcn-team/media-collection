'use strict';

const Joi = require('joi');

const optionsObject = {
    language: Joi.string().length(2)
};

const userObject = {
    _id: Joi.string().hex().length(24),
    created: Joi.string().isoDate(),
    displayName: Joi.string(),
    email: Joi.string().email(),
    options: Joi.object(optionsObject),
    username: Joi.string().alphanum()
};

exports.signUpPayload = {
    username: Joi.string().alphanum().trim().required(),
    password: Joi.string().required(),
    displayName: Joi.string().trim().required(),
    email: Joi.string().email().trim().required()
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
    displayName: Joi.string().alphanum().trim(),
    email: Joi.string().email().trim()
};

exports.userResponse = {
    token: Joi.string(),
    user: Joi.object(userObject)
};
