'use strict';

angular.module('series').controller('SeriesCreateController', [
    '$scope', '$stateParams', '$location', 'Authentication',
    'SeriesServices', 'SeriesDataService', 'SeriesExposed',
    function($scope, $stateParams, $location, Authentication, SeriesServices, SeriesDataService, SeriesExposed) {
        $scope.authentication = Authentication.checkAuth();

        $scope.debugFunc = function () {
            var series = SeriesDataService.createSeriesFromModel($scope.mediaModel);
            console.log(series);
        };

        $scope.initCreate = function () {
            $scope.isDetails = false;
            $scope.mediaModel = SeriesDataService.initSeriesModel();
            SeriesExposed.getCollectionNames().$promise.then(function (result) {
                $scope.listExisting = result;
            });
        };

        $scope.applyEpisodes = function () {
            angular.forEach($scope.mediaModel.seasonList, function (current) {
                current.episodes = $scope.seriesData.episodesNb;
            });
        };

        $scope.validateSeries = function () {

            function seasonUpdate() {
                var tmp = $scope.mediaModel.seasonList;
                $scope.mediaModel.seasonList = [];
                for (var i = $scope.mediaModel.seasonStart; i <= $scope.mediaModel.seasonEnd; i++) {
                    $scope.mediaModel.seasonList.push({ name: i });
                }
                if (tmp)
                    $scope.mediaModel.seasonList.FindAndCopyByProp(tmp, 'name');
            }

            $scope.isDetails = true;
            $scope.$watch('mediaModel.seasonStart', seasonUpdate, true);
            $scope.$watch('mediaModel.seasonEnd', seasonUpdate, true);
        };

        $scope.$watch('mediaModel.seen', function () {
            $scope.displayLastSeen = false;
            if ($scope.mediaModel.seen === 'ONGOING') {
                $scope.displayLastSeen = true;
                angular.forEach($scope.mediaModel.seasonList, function (current) {
                    if (!current.episodes) {
                        $scope.displayLastSeen = false;
                    }
                });
            }
        }, true);

        $scope.updateEpList = function () {
            if ($scope.mediaModel.lastSeenSeason) {
                $scope.tmpEpList = [];
                var idx = -1;
                angular.forEach($scope.mediaModel.seasonList, function (current, index) {
                    if (current.name === $scope.mediaModel.lastSeenSeason) {
                        idx = index;
                    }
                });
                if (idx > -1) {
                    for (var i = 1; i <= $scope.mediaModel.seasonList[idx].episodes; i++) {
                        $scope.tmpEpList.push(i);
                    }
                }
            }
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

        // Create new Series
        $scope.create = function() {
            // Create new Series object
            var series = SeriesDataService.createSeriesFromModel($scope.mediaModel);

            SeriesServices.createTvShow(series).then(function(response) {
                $location.path('series/' + response.data._id);

                // Clear form fields
                delete $scope.mediaModel;
            }, function(errorResponse) {
                console.error(errorResponse.data);
            });
        };
    }
]);
