'use strict';

angular.module('mediacollection').factory('InterceptorsService', [
    '$q', '$injector',
    function ($q, $injector) {
        var interceptorService = {};

        interceptorService.responseError = function (response) {
            if (response.status === 401 && response.config.url.indexOf('/api/users/') === -1) {
                $injector.get('Authentication').dropCredentials();
            }
            return $q.reject(response);
        };

        return interceptorService;
    }
]);
