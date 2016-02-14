'use strict';

const services = require('./services');

exports.getBookFromGoogle = (request, reply) => {
    services.findBookByIsbn(request.params, (err, res) => {
        if (err) {
            return reply(err.error).code(err.code);
        } else {
            return reply(res.data).code(res.code);
        }
    });
};
