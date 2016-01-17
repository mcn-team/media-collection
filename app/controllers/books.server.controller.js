'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    Book = mongoose.model('Book'),
    mwAPI = require('../../my_modules/wikiSearchAPI/lib/mediaWikiApi.js'),
    _ = require('lodash');

exports.apiSearchByTitle = function (req, res) {
    var WikiApi = new mwAPI();
    WikiApi.searchByTitle(req.query.toSearch, function (response) {
        if (response[0].error) {
            res.jsonp(response);
        } else {
            /*
            var tab = [];
            var matching = req.query.toSearch.split(' ');
            response.forEach(function (current) {
                for (var i = 0; i < matching.length; i++) {
                    //TODO: Extension methods ContainsLower
                    if (current.pageTitle.indexOf(matching[i]) !== -1) {
                        tab.push(current);
                        break;
                    }
                }
            });
            res.jsonp(tab);
            */
            res.jsonp(response);
        }
    });
};

exports.apiSearchById = function (req, res) {
    var WikiApi = new mwAPI();
    WikiApi.searchInfoById(req.query.toSearch, 'book', function (response) {
        res.jsonp(response);
    });
};

/**
 * Create a Book
 */
exports.create = function(req, res) {
    var book = new Book(req.body);
    book.user = req.user;

    book.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(book);
        }
    });
};

/**
 * Show the current Book
 */
exports.read = function(req, res) {
    res.jsonp(req.book);
};

/**
 * Update a Book
 */
exports.update = function(req, res) {
    var book = req.book ;

    book = _.extend(book , req.body);

    book.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(book);
        }
    });
};

/**
 * Delete a Book
 */
exports.delete = function(req, res) {
    var book = req.book ;

    book.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(book);
        }
    });
};

/**
 * List of Books
 */
exports.list = function(req, res) {
    Book.find().sort('-created').populate('user', 'displayName').exec(function(err, books) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(books);
        }
    });
};



/**
 * Book exposed API
 *
 * Exposed through books-exposed service factory functions for other module.
 * getLatestBook : retrieve the last inserted book in DB
 *
 * @param req request from frontend to /api/books/latest
 * @param res response to frontend containing the last entry or an empty tab
 */
exports.getLatestBook = function(req, res) {
    Book.findOne().sort('-created').exec(function(err, book) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(book);
        }
    });
};

/**
 * List of Collection Names
 */
exports.getCollectionNames = function (req, res) {
    var checkCollection = function() {
        return this.collectionName && this.collectionName !== '';
    };

    Book.find().$where(checkCollection).distinct('collectionName').exec(function(err, books) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(books);
        }

    });

};

/**
 * List of Collections
 */
exports.getCollectionsList = function(req, res) {

    var collections = [];

    function sortByVolume(a, b) {
        return (parseInt(a.volume) > parseInt(b.volume)) ? 1 : -1;
    }

    function createCollectionObjects(books) {
        function addMissingVolumes(idx) {
            collections[idx].missing = 0;
            var listVolumes = [];
            var listNotBought = [];
            var lastOne = 0;

            for (var j = 0; j < collections[idx].books.length; j++) {
                if (collections[idx].books[j].bought) {
                    listVolumes.push(parseInt(collections[idx].books[j].volume));
                } else {
                    listNotBought.push(parseInt(collections[idx].books[j].volume));
                }
                if (lastOne < parseInt(collections[idx].books[j].volume)) {
                    lastOne = parseInt(collections[idx].books[j].volume);
                }
            }
            collections[idx].owned = listVolumes.length;
            for (var i = 0; i < lastOne; i++) {
                if (listVolumes.indexOf(i + 1) === -1) {
                    if (listNotBought.indexOf(i + 1) === -1) {
                        collections[idx].books.push(
                            {
                                collectionName: collections[idx].name,
                                volume: i + 1,
                                bought: false
                            });
                    }
                    collections[idx].missing += 1;
                }
            }
        }

        books.forEach(function(current, idx, array) {
            var flag = false;
            for (var i = 0; i < collections.length; i++) {
                if (current.collectionName === collections[i].name) {
                    collections[i].books.push(current);
                    flag = true;
                }
            }
            if (flag === false) {
                collections.push({ name: current.collectionName, books: [ current ], isCollapsed: true });
            }
        });
        for (var j = 0; j < collections.length; j++) {
            addMissingVolumes(j);
            collections[j].books.sort(sortByVolume);
        }

    }

    var checkCollection = function() {
        return this.collectionName && this.collectionName !== '';
    };

    Book.find().$where(checkCollection).sort('collectionName').exec(function(err, books) {
        createCollectionObjects(books);
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(collections);
        }
    });
};

/*
 * Get missing books from a collection
 */
exports.getMissing = function (req, res) {

    function createTabVolumes(books, volLimit) {
        var tab = [];
        for (var j = 1; j < volLimit; j++) {
            tab.push(j);
        }
        for (var i = 0; i < books.length; i++) {
            var idx = tab.indexOf(books[i].volume);
            if (idx > -1) {
                tab.splice(idx, 1);
            }
        }
        return tab;
    }

    Book.find()
        .where('collectionName').equals(req.query.collection)
        .where('volume').lt(req.query.volume)
        .exec(function (err, books) {
            var missingVolumes = createTabVolumes(books, req.query.volume);
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp(missingVolumes);
            }
    });
};

/**
 * Book middleware
 */
exports.bookByID = function(req, res, next, id) { 
    Book.findById(id).populate('user', 'displayName').exec(function(err, book) {
        if (err) return next(err);
        if (! book) return next(new Error('Failed to load Book ' + id));
        req.book = book ;
        next();
    });
};

/**
 * Book authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
    /*if (req.book.user.id !== req.user.id) {
        return res.status(403).send('User is not authorized');
    }*/
    next();
};
