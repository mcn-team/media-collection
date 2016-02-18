'use strict';

const Joi = require('joi');

exports.moviePayload = {
    _id: Joi.string().hex().length(24),
    title: Joi.string().trim().required(),
    type: Joi.string().required(),
    movieRate: Joi.number().min(0).max(10),
    collectionName: Joi.string().trim(),
    episode: Joi.number(),
    directors: Joi.array().items(Joi.string()),
    producers: Joi.array().items(Joi.string()),
    scenarists: Joi.array().items(Joi.string()),
    actors: Joi.array().items(Joi.string()),
    price: Joi.number().precision(2).positive(),
    duration: Joi.number().integer().positive(),
    releaseDate: Joi.date().iso(),
    seen: Joi.boolean(),
    bought: Joi.boolean(),
    cover: Joi.string().uri(),
    created: Joi.date().iso(),
    user: Joi.string().hex().length(24)
};
