'use strict';

angular.module('my-api-film').factory('myApiFilmExposed', ['$resource',
        function($resource) {
            return {
                lastTrailer: function (count) {
                    return $resource('/api/myApiFilm/:apiAction', {}, {
                        getLastTrailer: {
                            method: 'GET',
                            params: {
                                apiAction: 'latestTrailer',
                                count: count
                            }
                        }
                    }).getLastTrailer();
                }
            };
        }
    ]);
