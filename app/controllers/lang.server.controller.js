'use strict';

/**
 * Module dependencies.
 */
var errorHandler = require('./errors.server.controller'),
    _ = require('lodash');

/**
 * Create a Lang
 */
//exports.create = function(req, res) {
//
//};

/**
 * Show the current Lang
 */
//exports.read = function(req, res) {
//
//};

/**
 * Update a Lang
 */
//exports.update = function(req, res) {
//
//};

/**
 * Delete an Lang
 */
//exports.delete = function(req, res) {
//
//};

/**
 * List of Langs
 */
//exports.list = function(req, res) {
//
//};

/**
 * Get language file
 */
exports.getLang = function (req, res) {
    var test = require('../langs/language_' + req.query.lang + '.json');
    res.jsonp(test);
};
