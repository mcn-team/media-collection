'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
    glob = require('glob');

/**
 * Load app configurations
 */
module.exports = _.extend(
    require('./env/all'),
    require('./env/' + (process.env.NODE_ENV || 'development'))
);
