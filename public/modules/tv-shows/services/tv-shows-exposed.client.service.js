/**
 * Created by matthias.brunet on 02/02/2015.
 */

'use strict';

angular.module('tv-shows').factory('TvShowsExposed', ['$resource',
        function ($resource) {
            var exposedApi = {};

            exposedApi.getLatest = {
                method: 'GET',
                isArray: false,
                params: {
                    apiAction: 'latest'
                }
            };

            exposedApi.getCollectionNames = {
                method: 'GET',
                isArray: true,
                params: {
                    apiAction: 'names'
                }
            };

            exposedApi.getCollections = {
                method: 'GET',
                isArray: true,
                params: {
                    apiAction: 'collections'
                }
            };

            return $resource('/api/tvshows/:apiAction', {}, exposedApi);
        }
    ]);
