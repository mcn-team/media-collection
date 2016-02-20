'use strict';

const TvShow = require('mongoose').model('TvShow');
const _ = require('lodash');

const responseHelper = require('../../utils/response-helper');

exports.findTvShows = (callback) => {
    TvShow.find().sort('-created').exec((err, tvShows) => {
        responseHelper.serviceCallback(err, tvShows, 200, callback);
    });
};

exports.saveTvShow = (payload, callback) => {
    const newTvShow = new TvShow(payload);

    newTvShow.save((err, tvShow) => {
        responseHelper.serviceCallback(err, tvShow, 201, callback);
    });
};

exports.findOneTvShow = (params, callback) => {
    TvShow.findOne({ _id: params.tvShowId }).populate('user').exec((err, tvShow) => {
        responseHelper.serviceCallback(err, tvShow, 200, callback);
    });
};

exports.updateTvShow = (params, payload, callback) => {
    TvShow.findOneAndUpdate({ _id: params.tvShowId }, payload).exec((err, tvShow) => {
        responseHelper.serviceCallback(err, _.merge(tvShow, payload), 201, callback);
    })
};

exports.removeTvShow = (params, callback) => {
    TvShow.findOneAndRemove({ _id: params.tvShowId }).exec((err, response) => {
        responseHelper.serviceCallback(err, response, 204, callback);
    });
};

exports.findCollectionNames = (callback) => {
    const options = {
        name: {
            $nin: [ null, '' ]
        }
    };

    TvShow.distinct('name', options).exec((err, names) => {
        responseHelper.serviceCallback(err, names, 200, callback);
    });
};
