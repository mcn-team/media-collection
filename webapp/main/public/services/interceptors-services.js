'use strict';

angular.module('mediacollection').factory('InterceptorsService', [
    '$q', 'Authentication',
    function ($q, Authentication) {
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
