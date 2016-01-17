'use strict';

angular.module('movies').controller('ListMovieCollectionController', ['$scope', '$location', 'Authentication', '$anchorScroll', 'StatsMovieService', 'MoviesExposed',
    function($scope, $location, Authentication, $anchorScroll, StatsMovieService, MoviesExposed) {
        $scope.authentication = Authentication;

        $scope.goToStats = function() {
            $location.hash('stats');
            $anchorScroll();
        };

        $scope.findCollection = function() {
            $scope.oneAtTime = true;
            $scope.goTo = function(path) {
                if (path && path !== undefined) {
                    $location.path('/movies/' + path);
                }
            };

            $scope.movies = [];

            function getCollectionCallback() {
                $scope.collectionTab.sort(function(a, b) { return a.name > b.name ? 1 : -1; });
                $scope.stats = StatsMovieService.calculate($scope.collectionTab);
                $scope.isLoaded = true;
            }

            MoviesExposed.getCollections().$promise.then(function(result) {
                $scope.collectionTab = result;
                getCollectionCallback();
            });
        };
    }
]);
