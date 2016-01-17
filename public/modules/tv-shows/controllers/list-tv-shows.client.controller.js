'use strict';

// List Tv shows controller
angular.module('tv-shows').controller('ListTvShowsController', ['$scope', '$location', '$anchorScroll', 'Authentication', 'TvShows',
    'TvShowsDataService', 'StatsTvShowsService',
    function($scope, $location, $anchorScroll, Authentication, TvShows, TvShowsService, StatsService) {
        $scope.authentication = Authentication;

        $scope.goToStats = function() {
            $location.hash('stats');
            $anchorScroll();
        };

        // Find a list of Tv shows
        $scope.find = function() {
            TvShows.query().$promise.then(function (result) {
                $scope.tvShows = result;
                $scope.isLoaded = true;
                $scope.$watch('filteredTvShows', function () {
                    $scope.stats = StatsService.calculate($scope.filteredTvShows);
                }, true);
            });
        };

        $scope.getDisplayList = function (array) {
            return TvShowsService.getDisplayList(array);
        };
    }
]);
