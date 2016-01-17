'use strict';

// Movies controller
angular.module('movies').controller('CreateMoviesController', ['$scope', '$stateParams', '$location', '$modal', '$log', 'Authentication', 'Movies',
    'AlloCineAPIExposed', 'TypesMovieService', 'MovieDataService', 'MoviesExposed',
    function($scope, $stateParams, $location, $modal, $log, Authentication, Movies, AlloCineExposed, TypesMovieService, MovieDataService, MoviesExposed) {
        $scope.authentication = Authentication;
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

            $scope.listExisting = MoviesExposed.getCollectionNames();

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
                Movies.get(
                    { movieId: $location.search().param } )
                    .$promise
                    .then(function(result) {
                        cloneCallback(result);
                    });
            }

            // Bought field
            $scope.mediaModel.bought = true;

            // Seen field
            $scope.mediaModel.seen = false;

            // Init Movie Model Lists
            $scope.mediaModel = MovieDataService.initMovieModelLists($scope.mediaModel, 'actorsList');
            $scope.mediaModel = MovieDataService.initMovieModelLists($scope.mediaModel, 'producersList');
            $scope.mediaModel = MovieDataService.initMovieModelLists($scope.mediaModel, 'directorsList');
            $scope.mediaModel = MovieDataService.initMovieModelLists($scope.mediaModel, 'scenaristsList');

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
                console.log($scope.mediaModel[itemList]);
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

            //Episode field
            $scope.checkAddEpisode = function() {
                return !$scope.mediaModel.collectionName || $scope.mediaModel.collectionName === '';
            };
        };


        // Create new Movie
        $scope.create = function() {
            // Create new Movie object
            var movie = MovieDataService.createMovieFromMovieModel($scope.mediaModel);

            // Redirect after save
            movie.$save(function(response) {
                $location.path('/movies/' + response._id);

                // Clear form fields
                $scope.mediaModel = {};
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
                $scope.mediaModel.actorsList.pop();
                $scope.mediaModel.producersList.pop();
                $scope.mediaModel.directorsList.pop();
                $scope.mediaModel.scenaristsList.pop();
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
            function searchCallback(result) {
                //console.log(result);
                $scope.movieList = result;
                $scope.open();
            }

            AlloCineExposed.search($scope.mediaModel.searchMovie, 20, 'movie').$promise.then(function(result) {
                searchCallback(result);
            });
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

            var modalInstance = $modal.open({
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
