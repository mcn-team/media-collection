'use strict';

const Joi = require('joi');

exports.idParams = {
    type: Joi.string().valid('book', 'serie'),
    id: Joi.any()
};

exports.titleParams = {
    title: Joi.string()
};
