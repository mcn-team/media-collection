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

        bookServices.getCollectionsList = function () {
            return $http.get(Config.migrationApiUrl + endpoint + '/collections');
        };

        bookServices.getCollection = function (collectionName, volume) {
            var route = '/collections/' + encodeURI(collectionName) + '/volumes/' + volume;
            return $http.get(Config.migrationApiUrl + endpoint + route);
        };

        bookServices.wikiSearchByTitle = function (title) {
            return $http.get(Config.migrationApiUrl + '/wiki/title/' + title);
        };

        bookServices.wikiSearchById = function (id) {
            return $http.get(Config.migrationApiUrl + '/wiki/type/book/id/' + id);
        };

        return bookServices;
    }
]);
