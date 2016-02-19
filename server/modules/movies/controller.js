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

exports.getMovie = (request, reply) => {
    services.findOneMovie(request.params, (err, res) => {
        responseHelper.controllerReply(err, res, reply);
    });
};

exports.updateBook = (request, reply) => {
    services.updateMovie(request.params, request.payload, (err, res) => {
        responseHelper.controllerReply(err, res, reply);
    });
};

exports.deleteMovie = (request, reply) => {
    services.removeMovie(request.params, (err, res) => {
        responseHelper.controllerReply(err, res, reply);
    });
};
