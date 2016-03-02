'use strict';

angular.module('users').factory('Authentication', [
    '$window', '$injector',
    function ($window, $injector) {
        var authServices = {};

        authServices.credentials = JSON.parse($window.localStorage.getItem('credentials'));
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

        return authServices;
    }
]);
