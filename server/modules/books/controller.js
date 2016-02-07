'use strict';

const services = require('./services');

exports.getAllBooks = (request, reply) => {
    services.findBooks((err, res) => {
        if (err) {
            return reply(err.error).code(err.code);
        } else {
            return reply(res.data).code(res.code);
        }
    });
};

exports.getBook = (request, reply) => {
    services.findOneBook(request.params, (err, res) => {
        if (err) {
            return reply(err.error).code(err.code);
        } else {
            return reply(res.data).code(res.code);
        }
    });
};

exports.createBook = (request, reply) => {
    services.saveBook(request.payload, (err, res) => {
        if (err) {
            return reply(err.error).code(err.code);
        } else {
            return reply(res.data).code(res.code);
        }
    });
};
