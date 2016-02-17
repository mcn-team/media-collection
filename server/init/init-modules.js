'use strict';

module.exports = (server) => {
    const users = require('../modules/users');
    const books = require('../modules/books');
    const auth = require('../modules/auth');
    const googleBookApi = require('../modules/google-book-api');
    const wikipediaApi = require('../modules/wikipedia-api');

    server.register(users.module, users.options, onError);
    server.register(books.module, books.options, onError);
    server.register(auth.module, onError);
    server.register(googleBookApi.module, googleBookApi.options, onError);
    server.register(wikipediaApi.module, wikipediaApi.options, onError);
};

const onError = (err) => {
    if (err) {
        throw err;
    }
};
