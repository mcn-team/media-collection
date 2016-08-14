'use strict';

const Joi = require('joi');

exports.isbnParamsSchema = {
    isbn: Joi.string().regex(/^\d{10}(\d{3})?$/).required()
};
