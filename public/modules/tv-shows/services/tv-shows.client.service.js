'use strict';

//Tv shows service used to communicate Tv shows REST endpoints
angular.module('tv-shows').factory('TvShows', ['$resource',
    function($resource) {
        return $resource('tv-shows/:tvShowId', { tvShowId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);