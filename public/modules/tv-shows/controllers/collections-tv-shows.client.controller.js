/**
 * Created by Kaze on 08/02/2015.
 */

'use strict';

angular.module('tv-shows').controller('CollectionsTvShowsController', [
    '$scope', '$location', '$anchorScroll', 'Authentication',
    'TvShowsExposed', 'StatsTvShowsService',
    function ($scope, $location, $anchorScroll, Authentication, TvShowsExposed, StatsService) {
        $scope.authentication = Authentication.checkAuth();
        $scope.oneAtTime = true;

        $scope.goToStats = function() {
            $location.hash('stats');
            $anchorScroll();
        };
        $scope.goTo = function(path) {
            if (path && path !== undefined) {
                $location.path('/tv-shows/' + path);
            }
        };


        TvShowsExposed.getCollections().$promise.then(function(result) {
            $scope.collectionTab = result;
            $scope.stats = StatsService.calculate(result);
            $scope.isLoaded = true;
        });

    }
]);
