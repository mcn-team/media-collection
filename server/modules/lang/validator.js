'use strict';

const Joi = require('joi');

exports.langQuery = {
    lang: Joi.string().length(2)
};
