'use strict';

module.exports = (server) => {
    const inert = require('inert');
    const staticFiles = require('../modules/static-files');
    const auth = require('../modules/auth');
    const users = require('../modules/users');
    const books = require('../modules/books');
    const movies = require('../modules/movies');
    const googleBookApi = require('../modules/google-book-api');
    const wikipediaApi = require('../modules/wikipedia-api');
    const allocineApi = require('../modules/allocine-api');

    server.register(inert, onError);
    server.register(staticFiles.module, onError);
    server.register(auth.module, onError);
    server.register(users.module, users.options, onError);
    server.register(books.module, books.options, onError);
    server.register(movies.module, movies.options, onError);
    server.register(googleBookApi.module, googleBookApi.options, onError);
    server.register(wikipediaApi.module, wikipediaApi.options, onError);
    server.register(allocineApi.module, allocineApi.options, onError);
};

const onError = (err) => {
    if (err) {
        throw err;
    }
};
