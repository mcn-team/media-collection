'use strict';

const services = require('./services');

exports.searchByTitle = (request, reply) => {
    services.findByTitle(request.params, (err, res) => {
        if (err) {
            return reply(err.error).code(err.code);
        } else {
            return reply(res.data).code(res.code);
        }
    });
};

exports.searchById = (request, reply) => {
    services.findById(request.params, (err, res) => {
        return reply(res.data).code(res.code);
    });
};
