'use strict';

angular.module('movies').controller('ListMoviesController', [
    '$scope', '$location', '$anchorScroll', '$window', 'Authentication',
    'StatsMovieService', 'MovieDataService', 'MovieServices', 'lodash',
    function($scope, $location, $anchorScroll, $window, Authentication,
             StatsMovieService, MovieDataService, MovieServices, _) {
        $scope.authentication = Authentication.checkAuth();
        $scope.mediaType = 'Movie';

        $scope.goToTop = function () {
            $window.scrollTo(0, 0);
        };

        $scope.goToStats = function() {
            $location.hash('stats');
            $anchorScroll();
        };

        $scope.updateMode = function () {
            if ($scope.searchParam === 'multi') {
                $window.sessionStorage.removeItem('movieSearchMode');
            } else {
                $window.sessionStorage.setItem('movieSearchMode', 'multi');
            }
            $scope.searchParam = $window.sessionStorage.getItem('movieSearchMode');
        };

        // Find a list of Movies
        $scope.find = function() {
            $scope.searchParam = $window.sessionStorage.getItem('movieSearchMode');

            MovieServices.getAllMovies().then(function (response) {
                $scope.movies = response.data;
                _.forEach($scope.movies, function (element) {
                    if (element.summary) {
                        element.truncatedSummary = element.summary.TruncIsh(450);
                    }
                });
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
