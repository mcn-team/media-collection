'use strict';

const Joi = require('joi');

exports.searchParams = {
    type: Joi.string(),
    name: Joi.string()
};
