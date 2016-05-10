'use strict';

const Joi = require('joi');

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

exports.optionsPayloadSchema = {
    language: Joi.string().alphanum().trim().optional()
};

exports.optionsParamsSchema = {
    userId: Joi.string().hex().length(24)
};
