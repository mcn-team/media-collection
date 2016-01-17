'use strict';

angular.module('movies').controller('searchMovieModalController', ['$scope', '$modalInstance', 'movieList', 'AlloCineAPIExposed',
    function ($scope, $modalInstance, movieList, AlloCineExposed) {
        $scope.isCollapsed = true;
        $scope.nothingFound = false;

        if (movieList[0].error) {
            $scope.nothingFound = true;
            $scope.stringSearched = movieList[0].searchReq;
        } else {
            $scope.movieList = movieList;
            $scope.selected = {
                movie: $scope.movieList[0]
            };
        }

        $scope.getMovieInfo = function (movie) {
            $scope.selected.movie = movie;

            function movieInfoCallback(result) {
                $scope.selected.movie.scenarists = result.scenarists;
                $scope.selected.movie.producers = result.producers;
                $scope.selected.movie.duration = result.duration;
                $scope.selected.movie.summary = result.summary.replace(/<[^>]*>/g, '');
                $scope.selected.movie.shortSummary = result.shortSummary.replace(/<[^>]*>/g, '');
                $scope.isCollapsed = false;
            }

            AlloCineExposed.getMediaInfo(movie.code, 'movie').$promise.then(function(result) {
                movieInfoCallback(result);
            });
        };

        $scope.ok = function () {
            $modalInstance.close($scope.selected.movie);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
]);
