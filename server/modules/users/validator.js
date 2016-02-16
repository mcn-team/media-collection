'use strict';

const Joi = require('joi');

exports.signUpPayload = {
    username: Joi.string().alphanum().trim().required(),
    password: Joi.string().required(),
    displayName: Joi.string().alphanum().trim().required(),
    email: Joi.string().email().trim().required()
};

exports.logInPayload = {
    username: Joi.string().alphanum().trim().required(),
    password: Joi.string().required()
};
