'use strict';

const services = require('./services');
const responseHelper = require('../../utils/response-helper');

exports.getMoviesList = (request, reply) => {
    services.findMovies((err, res) => {
        responseHelper.controllerReply(err, res, reply);
    });
};

exports.createMovie = (request, reply) => {
    services.saveMovie(request.payload, (err, res) => {
        responseHelper.controllerReply(err, res, reply);
    });
};
