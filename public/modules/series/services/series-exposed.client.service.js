/**
 * Created by Kaze on 01/06/2015.
 */

'use strict';

angular.module('series').factory('SeriesExposed', ['$resource',
    function($resource) {
        var exposedApi = {};

        exposedApi.getCollectionNames = {
            method: 'GET',
            isArray: true,
            params: {
                apiAction: 'names'
            }
        };

        return $resource('api/series/:apiAction', {}, exposedApi);
    }]);
