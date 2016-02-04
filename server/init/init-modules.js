'use strict';

module.exports = (server) => {
    const users = require('../modules/users');
    const books = require('../modules/books');

    server.register(users.module, users.options);
    server.register(books.module, books.options);
};
