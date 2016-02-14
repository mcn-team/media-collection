'use strict';

module.exports = (server) => {
    const users = require('../modules/users');
    const books = require('../modules/books');
    const auth = require('../modules/auth');
    const googleBookApi = require('../modules/google-book-api');
    const wikipediaApi = require('../modules/wikipedia-api');

    server.register(users.module, users.options);
    server.register(books.module, books.options);
    server.register(auth.module);
    server.register(googleBookApi.module, googleBookApi.options);
    server.register(wikipediaApi.module, wikipediaApi.options);
};
