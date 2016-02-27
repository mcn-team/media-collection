'use strict';

angular.module('allocine-api').factory('AlloCineAPIExposed', ['$resource', function($resource) {

    return {

        search: function(toSearch, count, filter) {
            return $resource('api/allocine/:apiAction', {}, {
                search: {
                    method: 'GET',
                    params: {
                        apiAction: 'search',
                        toSearch: toSearch,
                        count: count,
                        filter: filter
                    },
                    isArray: true
                }
            }).search();
        },

        getMediaInfo: function(code, mediaType) {
            return $resource('api/allocine/:apiAction', {}, {
                getMediaInfo: {
                    method: 'GET',
                    params: {
                        apiAction: 'getMediaInfo',
                        code: code,
                        mediaType: mediaType
                    }
                }
            }).getMediaInfo();
        }
    };
}
]);
