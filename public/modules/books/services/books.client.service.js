'use strict';

//Books service used to communicate Books REST endpoints
angular.module('books').factory('Books', ['$resource',
    function($resource) {
        return $resource('books/:bookId', { bookId: '@_id' }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);
