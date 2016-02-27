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

exports.removeMovie = (params, callback) => {
    Movie.findOneAndRemove({ _id: params.movieId }).exec((err, response) => {
        responseHelper.serviceCallback(err, response, 204, callback);
    });
};

exports.findLatest = (callback) => {
    Movie.findOne().sort('-created').exec((err, movie) => {
        responseHelper.serviceCallback(err, movie, 200, callback);
    });
};

exports.findCollections = (callback) => {
    const aggregation = [{
        $group: {
            _id: "$collectionName",
            data: { $push: "$$ROOT" },
            boughtTotal: {
                $sum: {
                    $cond: { if: { $eq: [ "$bought", true ] }, then: 1, else: 0 }
                }
            },
            toBoughtTotal: {
                $sum: {
                    $cond: [ { $eq: [ "$bought", false ] }, 1, 0 ]
                }
            },
            seenTotal: {
                $sum: {
                    $cond: [ { $eq: [ '$seen', true ] }, 1, 0 ]
                }
            },
            notSeenTotal: {
                $sum: {
                    $cond: [ { $eq: [ '$seen', false ] }, 1, 0 ]
                }
            }
        }
    }];

    Movie.aggregate(aggregation).exec((err, collections) => {
        responseHelper.serviceCallback(err, collections, 200, callback);
    });
};

exports.findCollectionNames = (callback) => {
    const options = {
        collectionName: {
            $nin: [ null, '' ]
        }
    };

    Movie.distinct('collectionName', options).exec((err, names) => {
        responseHelper.serviceCallback(err, names, 200, callback);
    });
};
