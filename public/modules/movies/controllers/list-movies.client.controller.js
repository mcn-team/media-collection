'use strict';

angular.module('movies').controller('ListMoviesController', [
    '$scope', '$location', '$anchorScroll', 'Authentication',
    'StatsMovieService', 'MovieDataService', 'MovieServices', 'LanguagesService',
    function($scope, $location, $anchorScroll, Authentication, StatsMovieService, MovieDataService, MovieServices, LanguagesService) {
        $scope.authentication = Authentication.checkAuth();

        $scope.mediaType = 'Movie';

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
                if (!LanguagesService.getPreloaded()) {
                    LanguagesService.getCurrentLang().getLang({ lang: 'en' }).$promise.then(function (result) {
                        $scope.translation = result;
                        $scope.isLoaded = true;
                        LanguagesService.setPreloaded($scope.translation);
                    });
                } else {
                    $scope.translation = LanguagesService.getPreloaded();
                    $scope.isLoaded = true;
                }
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
