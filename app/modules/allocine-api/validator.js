'use strict';

const Joi = require('joi');

const resultObject = {
    code: Joi.number(),
    originalTitle: Joi.string(),
    productionYear: Joi.number(),
    release: Joi.object(),
    castingShort: Joi.object(),
    statistics: Joi.object(),
    poster: Joi.object(),
    link: Joi.array().items(Joi.object())
};

const resultByIdObject = {
    code: Joi.number(),
    movieType: Joi.object(),
    originalTitle: Joi.string(),
    title: Joi.string(),
    productionYear: Joi.number(),
    genre: Joi.array().items(Joi.object()),
    release: Joi.object(),
    runtime: Joi.number(),
    synopsis: Joi.string(),
    synopsisShort: Joi.string(),
    castingShort: Joi.object(),
    castMember: Joi.array().items(Joi.object()),
    poster: Joi.object(),
    trailer: Joi.object(),
    dvdReleaseDate: Joi.object(),
    media: Joi.array().items(Joi.object()),
    statistics: Joi.object()
};

exports.searchParams = {
    type: Joi.string().valid('movie', 'tvseries', 'theater', 'news', 'video').required(),
    name: Joi.string().required()
};

exports.idParams = {
    type: Joi.string().valid('movie', 'tvseries', 'theater', 'news', 'video').required(),
    id: Joi.number().required()
};

exports.searchResponse = {
    result: Joi.array().items(resultObject),
    filter: Joi.string().valid('movie', 'tvseries', 'theater', 'news', 'video')
};

exports.searchByIdResponse = {
    result: Joi.array().items(resultByIdObject),
    filter: Joi.string().valid('movie', 'tvseries', 'theater', 'news', 'video')

};
