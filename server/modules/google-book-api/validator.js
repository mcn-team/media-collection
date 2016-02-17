'use strict';

const Joi = require('joi');

exports.isbnParams = {
    isbn: Joi.string().alphanum().min(10).max(13).required()
};
