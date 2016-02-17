'use strict';

module.exports = (server) => {
    const auth = require('../modules/auth');
    const users = require('../modules/users');
    const books = require('../modules/books');
    const movies = require('../modules/movies');
    const googleBookApi = require('../modules/google-book-api');
    const wikipediaApi = require('../modules/wikipedia-api');

    server.register(auth.module, onError);
    server.register(users.module, users.options, onError);
    server.register(books.module, books.options, onError);
    server.register(movies.module, movies.options, onError);
    server.register(googleBookApi.module, googleBookApi.options, onError);
    server.register(wikipediaApi.module, wikipediaApi.options, onError);
};

const onError = (err) => {
    if (err) {
        throw err;
    }
};
