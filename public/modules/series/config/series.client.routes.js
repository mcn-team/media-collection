'use strict';

//Setting up route
angular.module('series').config(['$stateProvider',
    function($stateProvider) {
        // Series state routing
        $stateProvider.
        state('listSeries', {
            url: '/series',
            templateUrl: 'modules/series/views/list-series.client.view.html'
        }).
        state('createSeries', {
            url: '/series/create',
            templateUrl: 'modules/series/views/create-series.client.view.html'
        }).
        state('viewSeries', {
            url: '/series/:seriesId',
            templateUrl: 'modules/series/views/view-series.client.view.html'
        }).
        state('editSeries', {
            url: '/series/:seriesId/edit',
            templateUrl: 'modules/series/views/edit-series.client.view.html'
        });
    }
]);