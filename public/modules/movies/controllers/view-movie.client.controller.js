'use strict';

// View Movie controller
angular.module('movies').controller('ViewMoviesController', [
    '$scope', '$stateParams', '$location', 'Authentication', 'MovieDataService', 'MovieServices',
    function($scope, $stateParams, $location, Authentication, MovieDataService, MovieServices) {
        $scope.authentication = Authentication.checkAuth();
        $scope.ratingMax = 10;
        $scope.isReadonly = true;
        $scope.showPercent = false;

        $scope.hoveringOver = function() {
            $scope.percent = 100 * ($scope.mediaModel.movieRate / $scope.ratingMax);
            $scope.showPercent = true;
        };

        $scope.ratingStates = [
            {stateOn: 'glyphicon-ok-sign', stateOff: 'glyphicon-ok-circle'},
            {stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty'},
            {stateOn: 'glyphicon-heart', stateOff: 'glyphicon-ban-circle'},
            {stateOn: 'glyphicon-heart'},
            {stateOff: 'glyphicon-off'}
        ];

        // Find existing Movie
        $scope.findOneView = function() {
            $scope.duplicateItem = function() {
                $location.path('/movies/create').search({param: $scope.movie._id});
            };

            function findMovieCallback() {
                $scope.mediaModel = MovieDataService.fillMovieModel($scope.movie);
                $scope.isLoaded = true;
            }

            MovieServices.getMovie($stateParams.movieId).then(function(response) {
                $scope.movie = response.data;
                findMovieCallback();
            });
        };

        // Remove existing Movie
        $scope.remove = function(movie) {
            if ( movie ) {
                movie.$remove();

                for (var i in $scope.movies) {
                    if ($scope.movies [i] === movie) {
                        $scope.movies.splice(i, 1);
                    }
                }
            } else {
                $scope.movie.$remove(function() {
                    $location.path('movies');
                });
            }
        };
    }
]);
