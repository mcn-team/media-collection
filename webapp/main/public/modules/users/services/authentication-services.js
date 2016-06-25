'use strict';

angular.module('users').factory('Authentication', [
    '$window', '$injector',
    function ($window, $injector) {
        var authServices = {};

        var httpConfig = null;

        var publicKey = null;

        authServices.credentials = JSON.parse($window.localStorage.getItem('credentials'));
        var buildEndpoint = function (path) {
            var creds = authServices.credentials ? authServices.credentials.token : null;
            httpConfig = {
                headers: {
                    'auth-web-token': creds
                }
            };
            return $injector.get('Config').apiRoute + path;
        };

        $injector.get('$http').get(buildEndpoint('/auth/key')).then(function (response) {
            publicKey = response.data.pub;
        });

        if (authServices.credentials) {
            $injector.get('$http').get(buildEndpoint('/users/options'), httpConfig).then(function (response) {
                authServices.credentials.user.options = response.data[0].options;
                authServices.setCredentials(authServices.credentials);
            });
        }

        authServices.user = authServices.credentials ? authServices.credentials.user : null;
        authServices.token = authServices.credentials ? authServices.credentials.token : null;

        authServices.checkAuth = function () {
            if (!authServices.credentials) {
                $injector.get('$state').go('home');
            }
            return authServices.isAuthenticated();
        };

        authServices.isAuthenticated = function () {
            return authServices.credentials;
        };

        authServices.setCredentials = function (credentials) {
            if (credentials) {
                $window.localStorage.setItem('credentials', JSON.stringify(credentials));
                authServices.credentials = JSON.parse($window.localStorage.getItem('credentials'));
                authServices.user = authServices.credentials.user;
                authServices.token = authServices.credentials.token;
            }
        };

        authServices.dropCredentials = function () {
            $window.localStorage.removeItem('credentials');
            authServices.credentials = null;
            authServices.user = null;
            authServices.token = null;
            $injector.get('$state').go('home');
        };

        authServices.getPublicKey = function () {
            return publicKey;
        };

        return authServices;
    }
]);
