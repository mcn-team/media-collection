'use strict';

module.exports = function(app) {
    var users = require('../../app/controllers/users.server.controller');
    var books = require('../../app/controllers/books.server.controller');
    var apiBooks = require('../../app/controllers/google-api-book.server.controller');

    // Books Routes
    app.route('/books')
        .get(users.requiresLogin, books.list)
        .post(users.requiresLogin, books.create);

    app.route('/books/:bookId')
        .get(users.requiresLogin, books.read)
        .put(users.requiresLogin, books.hasAuthorization, books.update)
        .delete(users.requiresLogin, books.hasAuthorization, books.delete);

    // Books api Routes
    app.route('/api/books/latest')
        .get(users.requiresLogin, books.getLatestBook);

    app.route('/api/books/collections')
        .get(users.requiresLogin, books.getCollectionsList);

    app.route('/api/books/names')
        .get(users.requiresLogin, books.getCollectionNames);

    app.route('/api/books/isbn')
        .get(users.requiresLogin, apiBooks.getBookByISBN);

    app.route('/api/books/missing')
        .get(users.requiresLogin, books.getMissing);

    app.route('/api/books/title-search')
        .get(users.requiresLogin, books.apiSearchByTitle);

    app.route('/api/books/id-search')
        .get(users.requiresLogin, books.apiSearchById);

    // Finish by binding the Book middleware
    app.param('bookId', books.bookByID);
};
