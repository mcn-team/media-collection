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
            return Config.apiRoute + path;
        };

        movieServices.getAllMovies = function () {
            return $http.get(buildEndpoint('/movies'), httpConfig);
        };

        movieServices.createMovie = function (data) {
            return $http.post(buildEndpoint('/movies'), data, httpConfig);
        };

        movieServices.getMovie = function (id) {
            return $http.get(buildEndpoint('/movies/' + id), httpConfig);
        };

        movieServices.updateMovie = function (id, data) {
            return $http.patch(buildEndpoint('/movies/' + id), data, httpConfig);
        };

        movieServices.deleteMovie = function (id) {
            return $http.delete(buildEndpoint('/movies/' + id), httpConfig);
        };

        movieServices.getLatest = function () {
            return $http.get(buildEndpoint('/movies/latest'), httpConfig);
        };

        movieServices.getCollections = function () {
            return $http.get(buildEndpoint('/movies/collections'), httpConfig);
        };

        movieServices.getCollectionNames = function () {
            return $http.get(buildEndpoint('/movies/collections/names'), httpConfig);
        };

        return movieServices;
    }
]);
