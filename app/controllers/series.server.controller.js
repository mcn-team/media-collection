'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    Series = mongoose.model('Series'),
    _ = require('lodash');

/**
 * Create a Series
 */
exports.create = function(req, res) {
    var series = new Series(req.body);
    series.user = req.user;

    series.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(series);
        }
    });
};

/**
 * Show the current Series
 */
exports.read = function(req, res) {
    res.jsonp(req.series);
};

/**
 * Update a Series
 */
exports.update = function(req, res) {
    var series = req.series ;

    series = _.extend(series , req.body);

    series.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(series);
        }
    });
};

/**
 * Delete an Series
 */
exports.delete = function(req, res) {
    var series = req.series ;

    series.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(series);
        }
    });
};

/**
 * List of Series
 */
exports.list = function(req, res) { 
    Series.find().sort('-created').populate('user', 'displayName').exec(function(err, series) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(series);
        }
    });
};

/**
 * List of Collection Names
 */

exports.getCollectionNames = function (req, res) {
    var checkCollection = function() {
        return this.series && this.series !== '';
    };

    Series.find().$where(checkCollection).distinct('series').exec(function(err, seriesNames) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(seriesNames);
        }
    });
};

/**
 * Series middleware
 */
exports.seriesByID = function(req, res, next, id) { 
    Series.findById(id).populate('user', 'displayName').exec(function(err, series) {
        if (err) return next(err);
        if (! series) return next(new Error('Failed to load Series ' + id));
        req.series = series ;
        next();
    });
};

/**
 * Series authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
    if (req.series.user.id !== req.user.id) {
        return res.status(403).send('User is not authorized');
    }
    next();
};
