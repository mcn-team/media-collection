'use strict';

// Movies controller
angular.module('movies').controller('CreateMoviesController', [
    '$scope', '$stateParams', '$location', '$uibModal', '$log', 'Authentication',
    'AlloCineExposed', 'AllocineDataService', 'TypesMovieService', 'MovieDataService', 'MovieServices',
    function($scope, $stateParams, $location, $uibModal, $log, Authentication,
             AlloCineExposed, AllocineDataService, TypesMovieService, MovieDataService, MovieServices) {
        $scope.authentication = Authentication.checkAuth();
        $scope.isLoaded = true;
        $scope.isDuplicate = false;
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

        $scope.initCreate = function () {
            function cloneCallback(result) {
                $scope.mediaModel = MovieDataService.fillMovieModel(result);
                $scope.isLoaded = true;
                $scope.isDuplicate = true;
            }

            MovieServices.getCollectionNames().then(function (response) {
                $scope.listExisting = response.data;
            });

            $scope.addCustomField = function () {
                if (!$scope.mediaModel.customFields) {
                    $scope.mediaModel.customFields = [];
                }
                $scope.mediaModel.customFields.push($scope.bookModel.custom);
                $scope.mediaModel.custom = {};
            };

            $scope.mediaModel = {
                custom: {}
            };
            $scope.mediaModel.movieRate = 7;
            if ($location.search() && $location.search().param) {
                $scope.isLoaded = false;
                MovieServices.getMovie($location.search().param)
                    .then(function(result) {
                        cloneCallback(result.data);
                    });
            }

            // Bought field
            $scope.mediaModel.bought = true;

            // Seen field
            $scope.mediaModel.seen = false;

            // Init Movie Model Lists
            MovieDataService.initAllLists($scope.mediaModel);

            // Variables for Type field
            if (!$scope.mediaModel.typeList) {
                $scope.mediaModel.typeList = TypesMovieService.getTypes();
                $scope.mediaModel.selectedType = $scope.mediaModel.typeList[0];
            }

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
                return val ? ($scope.mediaModel[key] && $scope.mediaModel[key][val] ? false : true)
                    : ($scope.mediaModel[key] ? false : true);
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

            //Episode field
            $scope.checkAddEpisode = function() {
                return !$scope.mediaModel.collectionName || $scope.mediaModel.collectionName === '';
            };
        };


        // Create new Movie
        $scope.validateForm = function() {
            // Create new Movie object
            var movie = MovieDataService.createMovieFromMovieModel($scope.mediaModel);

            MovieServices.createMovie(movie).then(function(response) {
                $location.path('/movies/' + response.data._id);

                // Clear form fields
                $scope.mediaModel = {};
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.cancelAddDupMovie = function() {
            var tmpUrl = $location.url().split('=')[1];

            if (tmpUrl) {
                delete $location.$$search.param;
                $location.url('/movies/' + tmpUrl);
            } else {
                $location.url('/movies');
            }
        };

        $scope.searchFilmByTitle = function () {
            AlloCineExposed.searchByName('movie', $scope.mediaModel.searchMovie).then(function (response) {
                $scope.movieList = AllocineDataService.formatSearchResult(response.data);
                if ($scope.movieList) {
                    $scope.open();
                } else {
                    $scope.noResultAlert = true;
                }
            });
        };

        $scope.closeAlert = function () {
            $scope.noResultAlert = false;
        };

        function fillMovieField(item) {
            $scope.mediaModel.title = item.title || item.originalTitle;
            $scope.mediaModel.summary = item.summary;
            $scope.mediaModel.duration = item.duration;
            $scope.mediaModel.releasedDate = item.releaseDate;
            $scope.mediaModel.cover = item.coverHref;
            $scope.mediaModel.actorsList = item.actors;
            $scope.mediaModel.directorsList = item.directors;
            $scope.mediaModel.producersList = item.producers;
            $scope.mediaModel.scenaristsList = item.scenarists;
            $scope.mediaModel.searchMovie = '';
        }

        $scope.open = function (size) {

            var modalInstance = $uibModal.open({
                templateUrl: 'searchMovieModalContent.html',
                controller: 'searchMovieModalController',
                size: size,
                resolve: {
                    movieList: function () {
                        return $scope.movieList;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                fillMovieField(selectedItem);
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
                $scope.mediaModel.searchMovie = '';
            });
        };
    }
]);
