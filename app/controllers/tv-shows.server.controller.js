'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    TvShow = mongoose.model('TvShow'),
    _ = require('lodash');

/**
 * Create a Tv show
 */
exports.create = function(req, res) {
    var tvShow = new TvShow(req.body);
    tvShow.user = req.user;

    tvShow.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(tvShow);
        }
    });
};

/**
 * Show the current Tv show
 */
exports.read = function(req, res) {
    res.jsonp(req.tvShow);
};

/**
 * Update a Tv show
 */
exports.update = function(req, res) {
    var tvShow = req.tvShow ;

    tvShow = _.extend(tvShow , req.body);

    tvShow.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(tvShow);
        }
    });
};

/**
 * Delete an Tv show
 */
exports.delete = function(req, res) {
    var tvShow = req.tvShow ;

    tvShow.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(tvShow);
        }
    });
};

/**
 * List of Tv shows
 */
exports.list = function(req, res) { 
    TvShow.find().sort('-created').populate('user', 'displayName').exec(function(err, tvShows) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(tvShows);
        }
    });
};

/**
 * Get latest entry
 */

exports.getLatest = function (req, res) {
    TvShow.findOne().sort('-created').exec(function (err, tvShow) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(tvShow);
        }
    });
};

/**
 * List of Collections
 */

exports.getCollections = function (req, res) {
    var collections = [];

    function sortBySeason(a, b) {
        return a.season > b.season ? 1 : -1;
    }

    function createCollectionsList(tvShows) {
        function addMissingSeason(idx) {
            collections[idx].missing = 0;
            var listSeasons = [];
            var listNotBought = [];
            var lastOne = 0;

            for (var i = 0; i < collections[idx].tvShows.length; i++) {
                if (collections[idx].tvShows[i].bought) {
                    listSeasons.push(collections[idx].tvShows[i].season);
                } else {
                    listNotBought.push(collections[idx].tvShows[i].season);
                }
                if (lastOne < collections[idx].tvShows[i].season) {
                    lastOne = collections[idx].tvShows[i].season;
                }
            }
            collections[idx].owned = listSeasons.length;
            for (var j = 0; j < lastOne; j++) {
                if (listSeasons.indexOf(j + 1) === -1) {
                    if (listNotBought.indexOf(j + 1) === -1) {
                        collections[idx].tvShows.push({
                            tvShowName: collections[idx].name,
                            season: j + 1,
                            bought: false
                        });
                    }
                    collections[idx].missing += 1;
                }
            }
        }

        tvShows.forEach(function (current) {
            var flag = false;
            for (var i = 0; i < collections.length; i++) {
                if (current.tvShowName === collections[i].name) {
                    collections[i].tvShows.push(current);
                    flag = true;
                }
            }
            if (flag === false) {
                collections.push({name: current.tvShowName, tvShows: [current], isCollapsed: true});
            }
        });
        for (var j = 0; j < collections.length; j++) {
            addMissingSeason(j);
            collections[j].tvShows.sort(sortBySeason);
        }
    }

    TvShow.find().sort('tvShowName').exec(function (err, tvShows) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            createCollectionsList(tvShows);
            res.jsonp(collections);
        }
    });
};

/**
 * List of Collection Names
 */

exports.getCollectionNames = function (req, res) {
    TvShow.find().distinct('tvShowName').exec(function (err, tvShows) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(tvShows);
        }
    });
};

/**
 * Tv show middleware
 */
exports.tvShowByID = function(req, res, next, id) { 
    TvShow.findById(id).populate('user', 'displayName').exec(function(err, tvShow) {
        if (err) return next(err);
        if (! tvShow) return next(new Error('Failed to load Tv show ' + id));
        req.tvShow = tvShow ;
        next();
    });
};

/**
 * Tv show authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
    if (req.tvShow.user.id !== req.user.id) {
        return res.status(403).send('User is not authorized');
    }
    next();
};
