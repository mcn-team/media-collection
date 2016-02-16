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
            return Config.migrationApiUrl + path;
        };

        userApi.login = function (payload) {
            return $http.post(Config.migrationApiUrl + '/users/login', payload);
        };

        userApi.signup = function (payload) {
            return $http.post(Config.migrationApiUrl + '/users/signup', payload);
        };

        userApi.updateUser = function (userId, payload) {
            return $http.patch(buildEndpoint('/users/' + userId), payload, httpConfig);
        };

        return userApi;
    }
]);
