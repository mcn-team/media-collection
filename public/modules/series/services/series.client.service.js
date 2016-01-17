'use strict';

//Series service used to communicate Series REST endpoints
angular.module('series').factory('Series', ['$resource',
    function($resource) {
        return $resource('series/:seriesId', { seriesId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);