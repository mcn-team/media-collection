'use strict';

angular.module('users').factory('UserServices', [
    '$http', 'Config',
    function ($http, Config) {
        var userApi = {};

        userApi.login = function (payload) {
            return $http.post(Config.migrationApiUrl + '/users/login', payload);
        };

        userApi.signup = function (payload) {
            return $http.post(Config.migrationApiUrl + '/users/signup', payload);
        };

        return userApi;
    }
]);
