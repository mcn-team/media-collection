'use strict';

const Joi = require('joi');
const _ = require('lodash');

const commonMoviePayload = {
    _id: Joi.string().hex().length(24),
    movieRate: Joi.number().min(0).max(10),
    collectionName: Joi.string().trim(),
    episode: Joi.number(),
    directors: Joi.array().items(Joi.string()),
    producers: Joi.array().items(Joi.string()),
    scenarists: Joi.array().items(Joi.string()),
    actors: Joi.array().items(Joi.string()),
    price: Joi.number().precision(2).positive(),
    duration: Joi.number().integer().positive(),
    releasedDate: Joi.date().iso(),
    seen: Joi.boolean(),
    bought: Joi.boolean(),
    cover: Joi.string().uri().allow(''),
    summary: Joi.string().allow(''),
    customFields: Joi.array(),
    lastElement: Joi.boolean(),
    created: Joi.date().iso(),
    user: Joi.string().hex().length(24)
};

exports.moviePayload = _.merge({
    title: Joi.string().trim().allow('').required(),
    type: Joi.string().required()
}, commonMoviePayload);

exports.movieParams = {
    movieId: Joi.string().hex().length(24).required()
};

exports.editMoviePayload = _.merge({
    title: Joi.string().trim().allow(''),
    type: Joi.string()
}, commonMoviePayload);
