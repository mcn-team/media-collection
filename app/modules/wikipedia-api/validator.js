'use strict';

const Joi = require('joi');

exports.idParams = {
    type: Joi.string(),
    id: Joi.any()
};

exports.titleParams = {
    title: Joi.string()
};
