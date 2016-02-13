'use strict';

angular.module('books').factory('BookServices', [
    '$http', 'Config',
    function ($http, Config) {
        var bookServices = {};

        var endpoint = '/books';

        bookServices.getAllBooks = function () {
            return $http.get(Config.migrationApiUrl + endpoint);
        };

        bookServices.getBook = function (bookId) {
            return $http.get(Config.migrationApiUrl + endpoint + '/' + bookId);
        };

        bookServices.addBook = function (newBook) {
            return $http.post(Config.migrationApiUrl + endpoint, newBook);
        };

        bookServices.updateBook = function (bookId, editedBook) {
            return $http.put(Config.migrationApiUrl + endpoint + '/' + bookId, editedBook);
        };

        bookServices.getLatest = function () {
            return $http.get(Config.migrationApiUrl + endpoint + '/latest');
        };

        bookServices.getCollectionNames = function () {
            return $http.get(Config.migrationApiUrl + endpoint + '/names');
        };

        bookServices.getBookByISBN = function (isbn) {
            return $http.get(Config.migrationApiUrl + '/isbn/' + isbn);
        };

        bookServices.getCollections = function () {
            return $http.get(Config.migrationApiUrl + endpoint + '/collections');
        };

        return bookServices;
    }
]);
