'use strict';

const Joi = require('joi');

exports.searchParams = {
    type: Joi.string(),
    name: Joi.string()
};

exports.idParams = {
    type: Joi.string(),
    id: Joi.number()
};
