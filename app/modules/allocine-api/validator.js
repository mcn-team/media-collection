'use strict';

const Joi = require('joi');

exports.searchParams = {
    type: Joi.string().valid('movie', 'tvseries', 'theater', 'news', 'video').required(),
    name: Joi.string().required()
};

exports.idParams = {
    type: Joi.string().valid('movie', 'tvseries', 'theater', 'news', 'video').required(),
    id: Joi.number().required()
};
