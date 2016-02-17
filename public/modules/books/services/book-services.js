'use strict';

angular.module('books').factory('BookServices', [
    '$http', 'Config', 'Authentication',
    function ($http, Config, Authentication) {
        var bookServices = {};

        var httpConfig = null;

        var buildEndpoint = function (path) {
            var creds = Authentication.credentials ? Authentication.credentials.token : null;
            httpConfig = {
                headers: {
                    'auth-web-token': creds
                }
            };
            return Config.migrationApiUrl + path;
        };

        bookServices.getAllBooks = function () {
            return $http.get(buildEndpoint('/books'), httpConfig);
        };

        bookServices.getBook = function (bookId) {
            return $http.get(buildEndpoint('/books/' + bookId), httpConfig);
        };

        bookServices.addBook = function (newBook) {
            return $http.post(buildEndpoint('/books'), newBook, httpConfig);
        };

        bookServices.updateBook = function (bookId, editedBook) {
            return $http.put(buildEndpoint('/books/' + bookId), editedBook, httpConfig);
        };

        bookServices.deleteBook = function (bookId) {
            return $http.delete(buildEndpoint('/books/' + bookId), httpConfig);
        };

        bookServices.getLatest = function () {
            return $http.get(buildEndpoint('/books/latest'), httpConfig);
        };

        bookServices.getCollectionNames = function () {
            return $http.get(buildEndpoint('/books/names'), httpConfig);
        };

        bookServices.getBookByISBN = function (isbn) {
            return $http.get(buildEndpoint('/isbn/' + isbn), httpConfig);
        };

        bookServices.getCollectionsList = function () {
            return $http.get(buildEndpoint('/books/collections'), httpConfig);
        };

        bookServices.getCollection = function (collectionName, volume) {
            var route = '/books/collections/' + encodeURI(collectionName) + '/volumes/' + volume;
            return $http.get(buildEndpoint(route), httpConfig);
        };

        bookServices.wikiSearchByTitle = function (title) {
            return $http.get(buildEndpoint('/wiki/title/' + title), httpConfig);
        };

        bookServices.wikiSearchById = function (id) {
            return $http.get(buildEndpoint('/wiki/type/book/id/' + id), httpConfig);
        };

        return bookServices;
    }
]);
