'use strict';

angular.module('tv-shows').controller('searchTvShowModalController', ['$scope', '$modalInstance', 'tvShowList', 'AlloCineAPIExposed',
    function ($scope, $modalInstance, tvShowList, AlloCineExposed) {
        $scope.isCollapsed = true;
        $scope.nothingFound = false;

        if (tvShowList[0].error) {
            $scope.nothingFound = true;
            $scope.stringSearched = tvShowList[0].searchReq;
        } else {
            $scope.tvShowList = tvShowList;
            $scope.selected = {
                tvShow: $scope.tvShowList[0]
            };
        }

        $scope.getTvShowInfo = function (tvShow) {
            $scope.selected.tvShow = tvShow;

            function tvShowInfoCallback(result) {
                $scope.selected.tvShow.producers = result.producers;
                $scope.selected.tvShow.duration = result.duration;
                $scope.selected.tvShow.summary = result.summary.replace(/<[^>]*>/g, '');
                $scope.selected.tvShow.shortSummary = result.shortSummary.replace(/<[^>]*>/g, '');
                $scope.isCollapsed = false;
            }

            AlloCineExposed.getMediaInfo(tvShow.code, 'tvseries').$promise.then(function(result) {
                tvShowInfoCallback(result);
            });
        };

        $scope.ok = function () {
            $modalInstance.close($scope.selected.tvShow);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
]);
