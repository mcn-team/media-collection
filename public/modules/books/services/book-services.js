'use strict';

angular.module('books').factory('BookServices', [
    '$http', 'Config',
    function ($http, Config) {
        var bookServices = {};

        var booksEndpoint = '/books';

        bookServices.getAllBooks = function () {
            return $http.get(Config.migrationApiUrl + booksEndpoint);
        };

        bookServices.getBook = function (bookId) {
            return $http.get(Config.migrationApiUrl + booksEndpoint + '/' + bookId);
        };

        bookServices.addBook = function (newBook) {
            return $http.post(Config.migrationApiUrl + booksEndpoint, newBook);
        };

        bookServices.updateBook = function (bookId, editedBook) {
            return $http.put(Config.migrationApiUrl + booksEndpoint + '/' + bookId, editedBook);
        };

        bookServices.getLatest = function () {
            return $http.get(Config.migrationApiUrl + booksEndpoint + '/latest');
        };

        bookServices.getCollectionNames = function () {
            return $http.get(Config.migrationApiUrl + booksEndpoint + '/names');
        };

        bookServices.getBookByISBN = function (isbn) {
            return $http.get(Config.migrationApiUrl + '/isbn/' + isbn);
        };

        return bookServices;
    }
]);
