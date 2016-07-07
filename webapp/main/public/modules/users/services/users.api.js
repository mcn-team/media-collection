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

        userApi.signup = function (payload, isAdmin) {
            if (isAdmin) {
                return $http.post(buildEndpoint('/users/signup'), payload, httpConfig);
            } else {
                return $http.post(Config.apiRoute + '/users/signup', payload);
            }
        };

        userApi.updateUser = function (userId, payload) {
            return $http.patch(buildEndpoint('/users/' + userId), payload, httpConfig);
        };

        userApi.getUsers = function () {
            return $http.get(buildEndpoint('/users'), httpConfig);
        };

        userApi.deleteUser = function (userId) {
            return $http.delete(buildEndpoint('/users/' + userId), httpConfig);
        };

        userApi.addUser = function (payload) {
            return $http.post(buildEndpoint('/users'), payload, httpConfig);
        };

        userApi.saveOptions = function (userId, payload) {
            return $http.patch(buildEndpoint('/users/' + userId + '/options'), payload, httpConfig);
        };

        userApi.isUser = function () {
            return $http.get(buildEndpoint('/users/count'))
        };

        userApi.getRecoveryList = function (userId) {
            return $http.get(buildEndpoint('/users/' + userId + '/recovery'), httpConfig);
        };

        userApi.patchRecovery = function (userId, payload) {
            return $http.patch(buildEndpoint('/users/' + userId + '/recovery'), payload, httpConfig);
        };

        return userApi;
    }
]);
