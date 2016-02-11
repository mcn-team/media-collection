'use strict';

module.exports = (server) => {
    const users = require('../modules/users');
    const books = require('../modules/books');
    const googleBookApi = require('../modules/google-book-api');

    server.register(users.module, users.options);
    server.register(books.module, books.options);
    server.register(googleBookApi.module, googleBookApi.options);
};
