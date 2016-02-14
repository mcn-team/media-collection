'use strict';

const services = require('./services');
const responseHelper = require('../../utils/response-helper');

exports.getAllBooks = (request, reply) => {
    services.findBooks((err, res) => {
        return responseHelper.controllerReply(err, res, reply);
    });
};

exports.getBook = (request, reply) => {
    services.findOneBook(request.params, (err, res) => {
        return responseHelper.controllerReply(err, res, reply);
    });
};

exports.createBook = (request, reply) => {
    services.saveBook(request.payload, (err, res) => {
        return responseHelper.controllerReply(err, res, reply);
    });
};

exports.updateBook = (request, reply) => {
    services.updateBook(request.payload, (err, res) => {
        return responseHelper.controllerReply(err, res, reply);
    });
};

exports.getLatestBook = (request, reply) => {
    services.findLatest((err, res) => {
        return responseHelper.controllerReply(err, res, reply);
    });
};

exports.getCollectionsList = (request, reply) => {
    services.findCollections((err, res) => {
        return responseHelper.controllerReply(err, res, reply);
    });
};

exports.getCollectionNamesList = (request, reply) => {
    services.findCollectionName((err, res) => {
        return responseHelper.controllerReply(err, res, reply);
    });
};

exports.getCollection = (request, reply) => {
    services.findOneCollection(request.params, (err, res) => {
        return responseHelper.controllerReply(err, res, reply);
    });
};
