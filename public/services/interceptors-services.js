'use strict';

angular.module('mediacollection').factory('InterceptorsService', [
    '$q', '$location', 'Authentication',
    function ($q, $location, Authentication) {
        var interceptorService = {};

        interceptorService.responseError = function (response) {
            if (response.status === 401) {
                Authentication.dropCredentials();
                $location.path('/');
            }
            return $q.reject(response);
        };

        return interceptorService;
    }
]);
