'use strict';

angular.module('mediacollection').factory('InterceptorsService', [
    '$q', '$injector',
    function ($q, $injector) {
        var interceptorService = {};

        interceptorService.responseError = function (response) {
            if (response.status === 401) {
                $injector.get('Authentication').dropCredentials();
            }
            return $q.reject(response);
        };

        return interceptorService;
    }
]);
