'use strict';

angular.module('users').factory('Authentication', [
    '$window', '$location',
    function ($window, $location) {
        var authServices = {};

        authServices.credentials = JSON.parse($window.localStorage.getItem('credentials'));

        authServices.checkAuth = function () {
            if (!authServices.credentials) {
                $location.path('/');
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
            }
        };

        authServices.dropCredentials = function () {
            $window.localStorage.removeItem('credentials');
            authServices.credentials = null;
            $location.path('/');
        };

        return authServices;
    }
]);
