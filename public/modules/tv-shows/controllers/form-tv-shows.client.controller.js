/**
 * Created by Kaze on 12/02/2015.
 */

'use strict';

angular.module('tv-shows').controller('FormTvShowsController', [
    '$scope', '$stateParams', '$location', '$log', 'Authentication', 'TvShows',
    'TvShowsExposed', 'TvShowsDataService', '$modal','AlloCineAPIExposed',
    function($scope, $stateParams, $location, $log, Authentication, TvShows, TvShowsExposed, TvShowService, $modal, AlloCineExposed) {

        $scope.editInit = function () {
            // Update existing Tv show
            $scope.update = function() {
                var tvShow = TvShowService.createTvShowFromModel($scope.mediaModel);
                tvShow._id = $scope.mediaModel._id;
                tvShow.$update(function() {
                    $location.path('tv-shows/' + tvShow._id);
                }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            };

            TvShows.get({ tvShowId: $stateParams.tvShowId }).$promise.then(function (result) {
                $scope.mediaModel = TvShowService.fillCreateTvShowModel(result);
                $scope.isLoaded = true;
                $scope.isCustomField = $scope.mediaModel.customFields ? true : false;
                if ($scope.mediaModel.lastSeen && $scope.mediaModel.lastSeen >= 0) {
                    $scope.isLastSeen = true;
                }
            });
        };

        $scope.createInit = function () {
            $scope.isDuplicate = false;
            $scope.mediaModel = {
                creatorsList: [],
                actorsList: [],
                producersList: [],
                seen: 'NOTSEEN',
                bought: true,
                tvShowRate: 7,
                custom: {}
            };

            if ($location.search() && $location.search().param) {
                $scope.mainTitle = 'Dupliquer une série';
                TvShows.get({ tvShowId: $location.search().param }).$promise.then(function (result) {
                    $scope.mediaModel = TvShowService.fillCreateTvShowModel(result);
                    $scope.isDuplicate = true;
                    $scope.isLoaded = true;
                });
            } else {
                $scope.isLoaded = true;
                $scope.mainTitle = 'Nouvelle série';
            }

            // Create new Tv show
            $scope.create = function() {
                // Create new Tv show object
                var tvShow = TvShowService.createTvShowFromModel($scope.mediaModel);

                // Redirect after save
                tvShow.$save(function(response) {
                    $location.path('tv-shows/' + response._id);

                    // Clear form fields
                    $scope.name = '';
                }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            };
            $scope.searchTVShowsByTitle = function () {
                function searchCallback(result) {
                    $scope.tvShowList = result;
                    $scope.open();
                }

                AlloCineExposed.search($scope.mediaModel.searchTvShow, 20, 'tvseries').$promise.then(function(result) {
                    searchCallback(result);
                });
            };
            function fillTvShowField(item) {
                $scope.mediaModel = TvShowService.fillModelFromModal(item);
                $scope.mediaModel.searchTvShow = '';
            }

            $scope.open = function (size) {

                var modalInstance = $modal.open({
                    templateUrl: 'searchTvShowModalContent.html',
                    controller: 'searchTvShowModalController',
                    size: size,
                    resolve: {
                        tvShowList: function () {
                            return $scope.tvShowList;
                        }
                    }
                });

                modalInstance.result.then(function (selectedItem) {
                    fillTvShowField(selectedItem);
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                    $scope.mediaModel.searchTvShow = '';
                });
            };
        };

        $scope.authentication = Authentication.checkAuth();
        $scope.ratingMax = 10;
        $scope.isReadonly = false;
        $scope.mediaModel = {
            scenaristsList: [],
            actorsList: [],
            directorsList: [],
            producersList: []
        };


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

        $scope.episodeHelper = 'Renseignez le nombre d\'épisode du média entré et non le total de la saison <br> (ex: le DVD/coffret ne contient que 10 des 20 épisodes de la saison, mettez 10)';
        $scope.durationHelper = 'Renseignez la durée moyenne d\'un épisode, et non le total';
        $scope.isLoaded = false;

        $scope.existingSeries = TvShowsExposed.getCollectionNames();

        $scope.cancelPage = function () {
            var id = $scope.mediaModel._id ? '/' + $scope.mediaModel._id : '';
            $location.path('/tv-shows' + id);
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

        $scope.addCustomField = function (key, val) {
            if (!$scope.mediaModel[key]) {
                $scope.mediaModel[key] = [];
            }
            $scope.mediaModel[key].push($scope.mediaModel[val]);
            $scope.mediaModel[val] = {};
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
    }
]);
