'use strict';

angular.module('movies').controller('ListMoviesController', [
    '$scope', '$location', '$anchorScroll', 'Authentication',
    'StatsMovieService', 'MovieDataService', 'MovieServices',
    function($scope, $location, $anchorScroll, Authentication, StatsMovieService, MovieDataService, MovieServices) {
        var self = this;
        $scope.authentication = Authentication.checkAuth();

        $scope.goToStats = function() {
            $location.hash('stats');
            $anchorScroll();
        };

        // Find a list of Movies
        $scope.find = function() {
            $scope.multiSearchOn = false;

            MovieServices.getAllMovies().then(function (response) {
                $scope.movies = response.data;
                $scope.$watch('filteredMovies', function () {
                    $scope.stats = StatsMovieService.calculate($scope.filteredMovies);
                }, true);

                $scope.isLoaded = true;
            });

            $scope.formatPeople = function (people) {
                return MovieDataService.getDisplayList(people);
            };

            $scope.restoreList = function () {
                $scope.multiSearch = undefined;
            };
        };
    }
]);
