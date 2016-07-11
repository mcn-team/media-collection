'use strict';

const Joi = require('joi');
const _ = require('lodash');

const commonBookPayload = {
    _id: Joi.string().hex().length(24),
    collectionName: Joi.string().trim(),
    volume: Joi.number(),
    authors: Joi.array().items(Joi.string()),
    isbn: Joi.string().allow(''),
    publishingDate: Joi.date().iso(),
    publisher: Joi.string().allow(''),
    cover: Joi.string().allow(''),
    read: Joi.string().allow(''),
    bought: Joi.boolean(),
    pageCount: Joi.number().integer(),
    bookRate: Joi.number(),
    summary: Joi.string().allow(''),
    price: Joi.number().precision(2).positive().allow(null),
    customFields: Joi.array(),
    created: Joi.date().iso(),
    user: Joi.string().hex().length(24)
};

exports.bookCreatePayload = _.merge({
    title: Joi.string().trim().allow('').optional(),
    type: Joi.string().required()
}, commonBookPayload);

exports.bookEditPayload = _.merge({
    title: Joi.string().trim().allow('').optional(),
    type: Joi.string()
}, commonBookPayload);

exports.bookParams = {
    bookId: Joi.string().hex().length(24).required()
};

exports.collectionsParams = {
    collection: Joi.string().required(),
    volume: Joi.number().integer().positive().required()
};
