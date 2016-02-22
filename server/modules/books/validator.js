'use strict';

const Joi = require('joi');
const _ = require('lodash');

const commonBookPayload = {
    _id: Joi.string().hex().length(24),
    collectionName: Joi.string().trim(),
    volume: Joi.number(),
    authors: Joi.array().items(Joi.string()),
    isbn: Joi.string(),
    publishingDate: Joi.date().iso(),
    publisher: Joi.string(),
    cover: Joi.string().uri(),
    read: Joi.string(),
    bought: Joi.boolean(),
    pageCount: Joi.number().integer().positive(),
    bookRate: Joi.number(),
    summary: Joi.string(),
    price: Joi.number().precision(2).positive(),
    customFields: Joi.array(),
    created: Joi.date().iso(),
    user: Joi.string().hex().length(24)
};

exports.bookCreatePayload = _.merge({
    title: Joi.string().trim().required(),
    type: Joi.string().required()
}, commonBookPayload);

exports.bookEditPayload = _.merge({
    title: Joi.string().trim(),
    type: Joi.string()
}, commonBookPayload);

exports.bookParams = {
    bookId: Joi.string().hex().length(24).required()
};

exports.collectionsParams = {
    collection: Joi.string().required(),
    volume: Joi.number().integer().positive().required()
};