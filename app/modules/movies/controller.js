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

exports.getLatestMovie = (request, reply) => {
    services.findLatest((err, res) => {
        responseHelper.controllerReply(err, res, reply);
    });
};

exports.getCollectionsList = (request, reply) => {
    services.findCollections((err, res) => {
        responseHelper.controllerReply(err, res, reply);
    });
};

exports.getCollectionNames = (request, reply) => {
    services.findCollectionNames((err, res) => {
        responseHelper.controllerReply(err, res, reply);
    });
};
