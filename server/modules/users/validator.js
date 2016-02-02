'use strict';

const Joi = require('joi');

exports.signUpPayload = {
    username: Joi.string().alphanum().trim().required(),
    password: Joi.string().required(),
    firstName: Joi.string().alphanum(),
    lastName: Joi.string().alphanum(),
    displayName: Joi.string().alphanum(),
    email: Joi.string().email()
};

exports.logInPayload = {
    username: Joi.string().alphanum().trim().required(),
    password: Joi.string().required()
};
