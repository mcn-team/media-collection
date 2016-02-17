'use strict';

module.exports = function(app) {
    var users = require('../../app/controllers/users.server.controller');
    var books = require('../../app/controllers/books.server.controller');
    var apiBooks = require('../../app/controllers/google-api-book.server.controller');

    // Books Routes
    app.route('/books')
        .get(books.list)
        .post(books.create);

    app.route('/books/:bookId')
        .get(books.read)
        .put(books.update)
        .delete(books.delete);

    // Books api Routes
    app.route('/api/books/latest')
        .get(books.getLatestBook);

    app.route('/api/books/collections')
        .get(books.getCollectionsList);

    app.route('/api/books/names')
        .get(books.getCollectionNames);

    app.route('/api/books/isbn')
        .get(apiBooks.getBookByISBN);

    app.route('/api/books/missing')
        .get(books.getMissing);

    app.route('/api/books/title-search')
        .get(books.apiSearchByTitle);

    app.route('/api/books/id-search')
        .get(books.apiSearchById);

    // Finish by binding the Book middleware
    app.param('bookId', books.bookByID);
};
