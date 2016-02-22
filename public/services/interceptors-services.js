'use strict';

ApplicationConfiguration.registerModule('auth');
angular.module('mediacollection').factory('InterceptorsService', [
    '$q', 'Authentication',
    function ($q, $location, Authentication) {
        var interceptorService = {};

        interceptorService.responseError = function (response) {
            if (response.status === 401) {
                Authentication.dropCredentials();
            }
            return $q.reject(response);
        };

        return interceptorService;
    }
]);
