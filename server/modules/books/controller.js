'use strict';

const services = require('./services');

const commonResponse = (reply, err, res) => {
    if (err) {
        return reply(err.error).code(err.code);
    } else {
        return reply(res.data).code(res.code);
    }
};

exports.getAllBooks = (request, reply) => {
    services.findBooks((err, res) => {
        return commonResponse(reply, err, res);
    });
};

exports.getBook = (request, reply) => {
    services.findOneBook(request.params, (err, res) => {
        return commonResponse(reply, err, res);
    });
};

exports.createBook = (request, reply) => {
    services.saveBook(request.payload, (err, res) => {
        return commonResponse(reply, err, res);
    });
};

exports.updateBook = (request, reply) => {
    services.updateBook(request.payload, (err, res) => {
        return commonResponse(reply, err, res);
    });
};
