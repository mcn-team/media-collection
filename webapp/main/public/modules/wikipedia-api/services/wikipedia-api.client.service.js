/**
 * Created by Kaze on 01/03/2015.
 */

'use strict';

angular.module('wikipedia-api').factory('WikipediaExposed', ['$resource',
    function ($resource) {
        var exposedApi = {};

        exposedApi.searchByTitle = {
            method: 'GET',
            isArray: true,
            params: {
                apiAction: 'title-search',
                typeSearch: '@type',
                toSearch: '@search'
            }
        };

        exposedApi.searchById = {
            method: 'GET',
            params: {
                apiAction: 'id-search',
                typeSearch: '@type',
                toSearch: '@search'
            }
        };

        return $resource('api/:typeSearch/:apiAction', {typeSearch: '@type', toSearch: '@search'}, exposedApi);
    }
]);
