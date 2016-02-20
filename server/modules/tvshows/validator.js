'use strict';

const Joi = require('joi');
const _ = require('lodash');

const commonTvshowPayload = {
    type: Joi.string(),
    seriesRate: Joi.number().min(0).max(10),
    seasons: Joi.array(),
    creators: Joi.array().items(Joi.string()),
    producers: Joi.array().items(Joi.string()),
    actors: Joi.array().items(Joi.string()),
    price: Joi.number().precision(2).positive(),
    cover: Joi.string().uri(),
    seen: Joi.string(),
    duration: Joi.number().integer().positive(),
    bought: Joi.boolean(),
    summary: Joi.string(),
    customFields: Joi.array(),
    created: Joi.date().iso(),
    user: Joi.string().hex().length(24),
    lastSeenSeason: Joi.number().integer(),
    lastSeenEp: Joi.number().integer(),
    year: Joi.number().integer(),
    channel: Joi.string()
};

exports.editPayload = _.merge({
    _id: Joi.string().hex().length(24),
    name: Joi.string().trim()
}, commonTvshowPayload);

exports.createPayload = _.merge({
    name: Joi.string().trim().required()
}, commonTvshowPayload);

exports.tvShowParams = {
    tvShowId: Joi.string().hex().length(24)
};