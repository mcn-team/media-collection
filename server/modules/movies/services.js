'use strict';

const Movie = require('mongoose').model('Movie');

const responseHelper = require('../../utils/response-helper');

exports.findMovies = (callback) => {
    Movie.find().sort('-created').exec((err, books) => {
        responseHelper.serviceCallback(err, books, 200, callback);
    });
};
