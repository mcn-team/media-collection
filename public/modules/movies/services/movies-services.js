'use strict';

angular.module('movies').factory('MovieServices', [
    '$http', 'Config', 'Authentication',
    function ($http, Config, Authentication) {
        var movieServices = {};

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

        movieServices.getAllMovies = function () {
            return $http.get(buildEndpoint('/movies'), httpConfig);
        };

        return movieServices;
    }
]);
