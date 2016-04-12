'use strict';

const _ = require('lodash');

const select = { select: ['API'] };

exports.users = _.merge({ routes: { prefix: '/api/users' } }, select);
exports.books = _.merge({ routes: { prefix: '/api/books' } }, select);
exports.movies = _.merge({ routes: { prefix: '/api/movies' } }, select);
exports.googleBookApi = _.merge({ routes: { prefix: '/api' } }, select);
exports.wikipediaApi = _.merge({ routes: { prefix: '/api/wiki' } }, select);
exports.allocineApi = _.merge({ routes: { prefix: '/api/allocine' } }, select);
exports.upload = _.merge({ routes: { prefix: '/api/upload' } }, select);
