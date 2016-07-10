'use strict';

angular.module('users').factory('UserServices', [
    '$rootScope', '$http', 'Config', 'Authentication',
    function ($rootScope, $http, Config, Authentication) {
        var userApi = {};
        var isSigned = false;
        var httpConfig = null;
        var buildEndpoint = function (path, token) {
            var creds = Authentication.credentials ? Authentication.credentials.token : null;

            httpConfig = {
                headers: {
                    'auth-web-token': token || creds
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
            return $http.get(buildEndpoint('/users/count'));
        };

        userApi.getRecoveryList = function (userId) {
            return $http.get(buildEndpoint('/users/' + userId + '/recovery'), httpConfig);
        };

        userApi.patchRecovery = function (userId, payload) {
            return $http.patch(buildEndpoint('/users/' + userId + '/recovery'), payload, httpConfig);
        };
        
        userApi.editQuestionRecovery = function (userId, payload) {
            return $http.patch(buildEndpoint('/users/' + userId + '/recovery/questions/edit'), payload, httpConfig);
        };

        userApi.getUserRecovery = function (username) {
            return $http.get(buildEndpoint('/users/' + username + '/forgot'));
        };

        userApi.getRecoveryToken = function (userId, payload) {
            return $http.post(buildEndpoint('/users/' + userId + '/forgot'), payload);
        };

        userApi.updateUserPassword = function (userId, payload, token) {
            return Authentication.getKey().then(function () {
                payload = Authentication.encryptCredentials(payload);
                return $http.patch(buildEndpoint('/users/' + userId + '/forgot', token), payload, httpConfig);
            });
        };

        userApi.setIsSigned = function (value) {
            isSigned = value;
            $rootScope.$emit('isSigned:changed');
        };

        userApi.getIsSigned = function () {
            return isSigned;
        };

        return userApi;
    }
]);
