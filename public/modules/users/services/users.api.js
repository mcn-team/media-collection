'use strict';

angular.module('users').factory('UserServices', [
    '$http', 'Config',
    function ($http, Config) {
        var bookApi = {};

        bookApi.login = function (payload) {
            return $http.post(Config.migrationApiUrl + '/users/login', payload);
        };

        bookApi.signup = function (payload) {
            return $http.post(Config.migrationApiUrl + '/users/signup', payload);
        };

        return bookApi;
    }
]);
