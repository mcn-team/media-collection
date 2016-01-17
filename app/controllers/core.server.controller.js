'use strict';

/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller');

exports.index = function(req, res) {
    res.render('index', {
        user: req.user || null,
        request: req
    });
};
