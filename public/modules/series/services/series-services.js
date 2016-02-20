'use strict';

angular.module('series').factory('SeriesServices', [
    '$http', 'Config', 'Authentication',
    function($http, Config, Authentication) {
        var seriesServices = {};

        var httpConfig = null;

        var endpoint = function (path) {
            var creds = Authentication.credentials ? Authentication.credentials.token : null;
            httpConfig = {
                headers: {
                    'auth-web-token': creds
                }
            };
            return Config.migrationApiUrl + path;
        };

        seriesServices.getTvShowsList = function () {
            return $http.get(endpoint('/tvshows'), httpConfig);
        };

        seriesServices.createTvShow = function (data) {
            return $http.post(endpoint('/tvshows'), data, httpConfig);
        };

        seriesServices.getTvShow = function (id) {
            return $http.get(endpoint('/tvshows/' + id), httpConfig);
        };

        seriesServices.updateTvShow = function (id, data) {
            return $http.patch(endpoint('/tvshows/' + id), data, httpConfig);
        };

        seriesServices.deleteTvShow = function (id) {
            return $http.delete(endpoint('/tvshows/' + id), httpConfig);
        };

        seriesServices.getCollectionNames = function () {
            return $http.get(endpoint('/tvshows/names'), httpConfig);
        };

        return seriesServices;
    }
]);
