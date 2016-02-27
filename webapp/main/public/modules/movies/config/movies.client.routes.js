'use strict';

//Setting up route
angular.module('movies').config(['$stateProvider',
    function($stateProvider) {
        // Videos state routing
        $stateProvider.
        state('listMovieCollections', {
            url: '/movies/collections',
            templateUrl: 'modules/movies/views/list-movie-collection.client.view.html'
        }).
        state('listMovies', {
            url: '/movies',
            templateUrl: 'modules/movies/views/list-movies.client.view.html'
        }).
        state('createMovie', {
            url: '/movies/create',
            templateUrl: 'modules/movies/views/create-movie.client.view.html'
        }).
        state('viewMovie', {
            url: '/movies/:movieId',
            templateUrl: 'modules/movies/views/view-movie.client.view.html'
        }).
        state('editMovie', {
            url: '/movies/:movieId/edit',
            templateUrl: 'modules/movies/views/edit-movie.client.view.html'
        });
    }
]);
