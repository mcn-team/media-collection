'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    Movie = mongoose.model('Movie'),
    _ = require('lodash');

/**
 * Create a Movie
 */
exports.create = function(req, res) {
    var movie = new Movie(req.body);
    movie.user = req.user;

    movie.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(movie);
        }
    });
};

/**
 * Show the current Movie
 */
exports.read = function(req, res) {
    res.jsonp(req.movie);
};

/**
 * Update a Movie
 */
exports.update = function(req, res) {
    var movie = req.movie ;

    movie = _.extend(movie , req.body);

    movie.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(movie);
        }
    });
};

/**
 * Delete an Movie
 */
exports.delete = function(req, res) {
    var movie = req.movie ;

    movie.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(movie);
        }
    });
};

/**
 * List of Movies
 */
exports.list = function(req, res) { 
    Movie.find().sort('-created').populate('user', 'displayName').exec(function(err, videos) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(videos);
        }
    });
};

/**
 * Movie exposed API
 *
 * Exposed through movies-exposed service factory functions for other module.
 *
 * getLatestMovie : retrieve the last inserted movie in DB
 *
 * @param req request from frontend to /api/movies/latest
 * @param res response to frontend containing the last entry or an empty tab
 */
exports.getLatestMovie = function(req, res) {
    Movie.findOne().sort('-created').exec(function(err, movie) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(movie);
        }
    });
};

/**
 * List of Collection Nsmes
 */
exports.getCollectionNames = function (req, res) {
    var checkCollection = function() {
        return this.collectionName && this.collectionName !== '';
    };

    Movie.find().$where(checkCollection).distinct('collectionName').exec(function(err, movies) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(movies);
        }

    });

};

/**
 * List of Collections
 */
exports.getCollectionsList = function(req, res) {

    var collections = [];

    function sortByEpisode(a, b) {
        return (parseInt(a.episode) > parseInt(b.episode)) ? 1 : -1;
    }

    function createCollectionObjects(movies) {
        function addMissingEpisodes(idx) {
            collections[idx].missing = 0;
            var listEpisodes = [];
            var listNotBought = [];
            var lastOne = 0;

            for (var j = 0; j < collections[idx].movies.length; j++) {
                if (collections[idx].movies[j].bought) {
                    listEpisodes.push(parseInt(collections[idx].movies[j].episode));
                } else {
                    listNotBought.push(parseInt(collections[idx].movies[j].episode));
                }
                if (lastOne < parseInt(collections[idx].movies[j].episode)) {
                    lastOne = parseInt(collections[idx].movies[j].episode);
                }
            }
            collections[idx].owned = listEpisodes.length;
            for (var i = 0; i < lastOne; i++) {
                if (listEpisodes.indexOf(i + 1) === -1) {
                    if (listNotBought.indexOf(i + 1) === -1) {
                        collections[idx].movies.push(
                            {
                                collectionName: collections[idx].name,
                                episode: i + 1,
                                bought: false
                            });
                    }
                    collections[idx].missing += 1;
                }
            }
        }

        movies.forEach(function(current, idx, array) {
            var flag = false;
            for (var i = 0; i < collections.length; i++) {
                if (current.collectionName === collections[i].name) {
                    collections[i].movies.push(current);
                    flag = true;
                }
            }
            if (flag === false) {
                collections.push({ name: current.collectionName, movies: [ current ], isCollapsed: true });
            }
        });
        for (var j = 0; j < collections.length; j++) {
            addMissingEpisodes(j);
            collections[j].movies.sort(sortByEpisode);
        }

    }

    var checkCollection = function() {
        return this.collectionName && this.collectionName !== '';
    };

    Movie.find().$where(checkCollection).sort('collectionName').exec(function(err, movies) {
        createCollectionObjects(movies);
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(collections);
        }

    });
};

/**
 * Movie middleware
 */
exports.movieByID = function(req, res, next, id) {
    Movie.findById(id).populate('user', 'displayName').exec(function(err, movie) {
        if (err) return next(err);
        if (! movie) return next(new Error('Failed to load Movie ' + id));
        req.movie = movie ;
        next();
    });
};

/**
 * Movie authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
    /*if (req.movie.user.id !== req.user.id) {
        return res.status(403).send('User is not authorized');
    }*/
    next();
};
