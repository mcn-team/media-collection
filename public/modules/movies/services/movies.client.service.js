'use strict';

//Videos service used to communicate Videos REST endpoints
angular.module('movies').factory('Movies', ['$resource',
    function($resource) {
        return $resource('movies/:movieId', { movieId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);
