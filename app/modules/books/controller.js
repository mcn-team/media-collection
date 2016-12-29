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
    services.updateBook(request.params, request.payload, (err, res) => {
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

exports.deleteBook = (request, reply) => {
    services.removeBook(request.params, (err, res) => {
        responseHelper.controllerReply(err, res, reply);
    });
};

exports.createMultiple = (request, reply) => {
    services.insertMany(request.payload, (err, res) => {
        responseHelper.controllerReply(err, res, reply);
    });
};

exports.getCustomFieldsKeys = (request, reply) => {
    services.findCustomFieldsKeys((err, res) => {
        responseHelper.controllerReply(err, res, reply);
    });
};

exports.getBooksFromCollection = (request, reply) => {
    services.findBooksFromCollection(request.params, (err, res) => {
        responseHelper.controllerReply(err, res, reply);
    });
};

exports.getAuthorNamesList = (request, reply) => {
    services.findAuthorNamesList((err, res) => {
        responseHelper.controllerReply(err, res, reply);
    });
};
