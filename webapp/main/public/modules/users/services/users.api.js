'use strict';

angular.module('users').factory('UserServices', [
    '$http', 'Config', 'Authentication',
    function ($http, Config, Authentication) {
        var userApi = {};

        var httpConfig = null;

        var buildEndpoint = function (path) {
            var creds = Authentication.credentials ? Authentication.credentials.token : null;

            httpConfig = {
                headers: {
                    'auth-web-token': creds
                }
            };

            return Config.apiRoute + path;
        };

        userApi.login = function (payload) {
            return $http.post(Config.apiRoute + '/users/login', payload);
        };

        userApi.signup = function (payload) {
            return $http.post(Config.apiRoute + '/users/signup', payload);
        };

        userApi.updateUser = function (userId, payload) {
            return $http.patch(buildEndpoint('/users/' + userId), payload, httpConfig);
        };

        userApi.getUsers = function () {
            return $http.get(buildEndpoint('/users'), httpConfig);
        };

        return userApi;
    }
]);
