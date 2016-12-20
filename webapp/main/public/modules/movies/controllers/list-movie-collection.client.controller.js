'use strict';

angular.module('movies').controller('ListMovieCollectionController', [
    '$scope', '$location', 'Authentication', '$anchorScroll', '$window',
    'StatsMovieService', 'MovieServices', 'MovieDataService',
    function($scope, $location, Authentication, $anchorScroll, $window, StatsMovieService, MovieServices, MovieDataService) {
        $scope.authentication = Authentication.checkAuth();
        $scope.showCompleted = false;

        $scope.goToTop = function () {
            $window.scrollTo(0, 0);
        };

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

            MovieServices.getCollections().then(function(result) {
                $scope.collectionTab = MovieDataService.computeMissing(result.data);
                $scope.collectionTab = MovieDataService.setCompletedCollection($scope.collectionTab);
                $scope.stats = StatsMovieService.calculate($scope.collectionTab);
                $scope.isLoaded = true;
            });
        };
    }
]);
