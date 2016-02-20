'use strict';

angular.module('allocine-api').factory('AlloCineExposed', [
    '$http', 'Config', 'Authentication',
    function ($http, Config, Authentication) {
        var allocineExposed = {};

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

        allocineExposed.searchByName = function (type, name) {
            return $http.get(endpoint('/allocine/type/' + type + '/name/' + name), httpConfig);
        };

        allocineExposed.getMovieById = function (type, id) {
            return $http.get(endpoint('/allocine/type/' + type + '/id/' + id), httpConfig);
        };

        return allocineExposed;
    }
]);
