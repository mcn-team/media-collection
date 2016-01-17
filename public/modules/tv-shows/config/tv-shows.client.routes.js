'use strict';

//Setting up route
angular.module('tv-shows').config(['$stateProvider',
    function($stateProvider) {
        // Tv shows state routing
        $stateProvider.
        state('listTvShowsCollections', {
            url: '/tv-shows/collections',
            templateUrl: 'modules/tv-shows/views/collections-tv-shows.client.view.html'
        }).
        state('listTvShows', {
            url: '/tv-shows',
            templateUrl: 'modules/tv-shows/views/list-tv-shows.client.view.html'
        }).
        state('createTvShow', {
            url: '/tv-shows/create',
            templateUrl: 'modules/tv-shows/views/create-tv-show.client.view.html'
        }).
        state('viewTvShow', {
            url: '/tv-shows/:tvShowId',
            templateUrl: 'modules/tv-shows/views/view-tv-show.client.view.html'
        }).
        state('editTvShow', {
            url: '/tv-shows/:tvShowId/edit',
            templateUrl: 'modules/tv-shows/views/edit-tv-show.client.view.html'
        });
    }
]);
