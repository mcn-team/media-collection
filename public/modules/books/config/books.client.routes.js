'use strict';

//Setting up route
angular.module('books').config(['$stateProvider',
    function($stateProvider) {
        // Books state routing
        $stateProvider.
        state('listBookCollections', {
            url: '/books/collections',
            templateUrl: 'modules/books/views/list-collection.client.view.html'
        }).
        state('listBooks', {
            url: '/books',
            templateUrl: 'modules/books/views/list-books.client.view.html'
        }).
        state('createBook', {
            url: '/books/create',
            templateUrl: 'modules/books/views/create-book.client.view.html'
        }).
        state('viewBook', {
            url: '/books/:bookId',
                // Resolve: ...
            templateUrl: 'modules/books/views/view-book.client.view.html'
        }).
        state('editBook', {
            url: '/books/:bookId/edit',
            templateUrl: 'modules/books/views/edit-book.client.view.html'
        });
    }
]);
