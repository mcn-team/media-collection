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

        return bookServices;
    }
]);
