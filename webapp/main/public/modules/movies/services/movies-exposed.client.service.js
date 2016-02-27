'use strict';

angular.module('movies').factory('MoviesExposed', ['$resource',
    function($resource) {
        return $resource('api/movies/:apiAction', {
        }, {
            lastOne: {
                method: 'GET',
                params: {
                    apiAction: 'latest'
                }
            },
            getCollections: {
                method: 'GET',
                isArray: true,
                params: {
                    apiAction: 'collections'
                }
            },
            getCollectionNames: {
                method: 'GET',
                isArray: true,
                params: {
                    apiAction: 'names'
                }
            }
        });
    }
]);
