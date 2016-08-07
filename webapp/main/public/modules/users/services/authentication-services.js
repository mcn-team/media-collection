'use strict';

angular.module('users').factory('Authentication', [
    '$window', '$injector', 'lodash', 'md5',
    function ($window, $injector, _, md5) {
        var authServices = {};

        var httpConfig = null;
        var publicKey = null;
        var encrypt = new JSEncrypt();


        var getCredentialsFromStorage = function () {
            authServices.credentials = {
                user: JSON.parse($window.localStorage.getItem('mc.user')),
                token: JSON.parse($window.localStorage.getItem('mc.token'))
            };

            if (!authServices.credentials.user || !authServices.credentials.token) {
                authServices.credentials = null;
            }
        };

        getCredentialsFromStorage();
        var buildEndpoint = function (path) {
            var creds = authServices.credentials ? authServices.credentials.token : null;
            httpConfig = {
                headers: {
                    'auth-web-token': creds
                }
            };
            return $injector.get('Config').apiRoute + path;
        };

        authServices.getKey = function () {
            return $injector.get('$http').get(buildEndpoint('/auth/key')).then(function (response) {
                publicKey = response.data.pub;
                encrypt.setPublicKey(publicKey);
                return true;
            });
        };

        authServices.getKey();

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

        var setCredentialsToStorage = function (credentials) {
            $window.localStorage.setItem('mc.user', JSON.stringify(credentials.user));
            $window.localStorage.setItem('mc.token', JSON.stringify(credentials.token));
        };

        authServices.setCredentials = function (credentials) {
            if (credentials) {
                setCredentialsToStorage(credentials);
                getCredentialsFromStorage();
                authServices.user = authServices.credentials.user;
                authServices.token = authServices.credentials.token;
            }
        };

        var removeCredentialsToStorage = function () {
            $window.localStorage.removeItem('mc.user');
            $window.localStorage.removeItem('mc.token');
        };

        authServices.dropCredentials = function () {
            removeCredentialsToStorage();
            authServices.credentials = null;
            authServices.user = null;
            authServices.token = null;
            $injector.get('$state').go('home');
        };

        authServices.encryptCredentials = function (data) {
            var credentials = _.assign({}, data);
            credentials.password = md5.createHash(credentials.password);
            credentials.password = encrypt.encrypt(credentials.password);
            return credentials;
        };

        authServices.encrypt = function (data) {
            return encrypt.encrypt(md5.createHash(data));
        };

        return authServices;
    }
]);
