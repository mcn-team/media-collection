'use strict';

angular.module('books').factory('BookServices', [
    '$http', 'Config',
    function ($http, Config) {
        var bookApi = {};

        bookApi.getAllBooks = function () {
            return $http.get(Config.migrationApiUrl + '/books');
        };

        return bookApi;
    }
]);
