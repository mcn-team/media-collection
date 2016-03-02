'use strict';

const options = require('./plugins-options');

module.exports = (server) => {
    server.register(require('inert'), onError);
    server.register(require('../modules/static-files'), onError);
    server.register(require('../modules/lang'), options.lang, onError);
    server.register(require('../modules/auth'), onError);
    server.register(require('../modules/users'), options.users, onError);
    server.register(require('../modules/books'), options.books, onError);
    server.register(require('../modules/movies'), options.movies, onError);
    server.register(require('../modules/google-book-api'), options.googleBookApi, onError);
    server.register(require('../modules/wikipedia-api'), options.wikipediaApi, onError);
    server.register(require('../modules/allocine-api'), options.allocineApi, onError);
};

const onError = (err) => {
    if (err) {
        throw err;
    }
};