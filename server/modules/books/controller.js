'use strict';

const services = require('./services');

exports.getBooks = (request, reply) => {
    services.findAllBooks((err, res) => {
        if (err) {
            return reply(err.error).code(err.code);
        } else {
            return reply(res.data).code(res.code);
        }
    });
};
