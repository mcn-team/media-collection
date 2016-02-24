'use strict';

// Movies controller
angular.module('movies').controller('EditMoviesController', [
    '$scope', '$stateParams', '$location', 'Authentication', 'MovieDataService', 'MovieServices',
    function($scope, $stateParams, $location, Authentication, MovieDataService, MovieServices) {
        $scope.authentication = Authentication.checkAuth();
        $scope.isLoaded = false;
        $scope.ratingMax = 10;
        $scope.isReadonly = false;

        $scope.hoveringOver = function(value) {
            $scope.overStar = value;
        };

        $scope.ratingStates = [
            {stateOn: 'glyphicon-ok-sign', stateOff: 'glyphicon-ok-circle'},
            {stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty'},
            {stateOn: 'glyphicon-heart', stateOff: 'glyphicon-ban-circle'},
            {stateOn: 'glyphicon-heart'},
            {stateOff: 'glyphicon-off'}
        ];

        // Update existing Movie
        $scope.validateForm = function() {
            var movie = MovieDataService.createMovieFromMovieModel($scope.mediaModel);

            movie._id = $scope.mediaModel._id;

            MovieServices.updateMovie(movie._id, movie).then(function() {
                $location.path('movies/' + movie._id);
                $scope.mediaModel = {};
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        MovieServices.getCollectionNames().then(function (response) {
            $scope.listExisting = response.data;
        });

        // Find existing Movie
        $scope.findOne = function() {

            function getOneCallback() {

                $scope.isCustomField = $scope.mediaModel.customFields ? true : false;

                $scope.addCustomField = function (key, val) {
                    if (!$scope.mediaModel[key]) {
                        $scope.mediaModel[key] = [];
                    }
                    $scope.mediaModel[key].push($scope.mediaModel[val]);
                    $scope.mediaModel[val] = {};
                };

                $scope.updateField = function(itemList, idx, newStr) {
                    $scope.mediaModel[itemList][idx] = newStr;
                };

                $scope.deleteField = function(itemList, index) {
                    $scope.mediaModel[itemList].splice(index, 1);
                };

                $scope.checkField = function (key, val) {
                    return val ? ($scope.mediaModel[key] && $scope.mediaModel[key][val] ? false : true) : ($scope.mediaModel[key] ? false : true);
                };

                $scope.addField = function(itemList, item) {
                    for (var i = 0; i < $scope.mediaModel[itemList].length; i++) {
                        if ($scope.mediaModel[itemList][i] === $scope.mediaModel[item]) {
                            $scope.mediaModel[item] = '';
                            return;
                        }
                    }

                    $scope.mediaModel[itemList].push($scope.mediaModel[item]);
                    $scope.mediaModel[item] = '';
                };

                $scope.isLoaded = true;
            }

            MovieServices.getMovie($stateParams.movieId).then(function (response) {
                $scope.mediaModel = MovieDataService.fillMovieModel(response.data);
                $scope.mediaModel._id = response.data._id;
                getOneCallback();
            });
        };

        $scope.cancelPage = function () {
            $location.path('/movies/' + $stateParams.movieId);
        };
    }
]);
