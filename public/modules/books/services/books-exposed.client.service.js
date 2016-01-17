'use strict';

angular.module('books').factory('BooksExposed', ['$resource',
    function($resource) {
        var exposedApi = {};

        exposedApi.lastOne = {
            method: 'GET',
            params: {
                apiAction: 'latest'
            }
        };

        exposedApi.getCollections = {
            method: 'GET',
            isArray: true,
            params: {
                apiAction: 'collections'
            }
        };

        exposedApi.getCollectionNames = {
            method: 'GET',
            isArray: true,
            params: {
                apiAction: 'names'
            }
        };

        exposedApi.getBookByISBN = {
            method: 'GET',
            params: {
                apiAction: 'isbn',
                isbn: '@isbn'
            }
        };

        exposedApi.getMissing = {
            method: 'GET',
            isArray: true,
            params: {
                apiAction: 'missing',
                collection: '@collectionName',
                volumeId: '@vol'
            }
        };

        return $resource('api/books/:apiAction', {isbn: '@isbn', collection: '@collectionName', volume: '@vol'}, exposedApi);
    }
]);
