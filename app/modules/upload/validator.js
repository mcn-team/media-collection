'use strict';

const Joi = require('joi');

exports.uploadParams = {
    mediaId: Joi.string().hex().length(24).required()
};
