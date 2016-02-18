'use strict';

const Movie = require('mongoose').model('Movie');
const _ = require('lodash');

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

exports.findOneMovie = (params, callback) => {
    Movie.findOne({ _id: params.movieId }).exec((err, movie) => {
        responseHelper.serviceCallback(err, movie, 200, callback);
    });
};

exports.updateMovie = (params, payload, callback) => {
    Movie.findOneAndUpdate({ _id: params.movieId }, payload).exec((err, movie) => {
        responseHelper.serviceCallback(err, _.merge(movie, payload), 201, callback);
    });
};
