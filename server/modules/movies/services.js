'use strict';

const Movie = require('mongoose').model('Movie');

const responseHelper = require('../../utils/response-helper');

exports.findMovies = (callback) => {
    Movie.find().sort('-created').exec((err, books) => {
        responseHelper.serviceCallback(err, books, 200, callback);
    });
};

exports.saveMovie = (payload, callback) => {
    const newMovie = new Movie(payload);

    newMovie.save((err, movie) => {
        responseHelper.serviceCallback(err, movie, 201, callback);
    });
};
