'use strict';

// Tv shows controller
angular.module('tv-shows').controller('ViewTvShowsController', [
    '$scope', '$stateParams', '$location', 'Authentication', 'TvShows', 'TvShowsDataService',
    function($scope, $stateParams, $location, Authentication, TvShows, TvShowsService) {
        $scope.authentication = Authentication.checkAuth();
        $scope.ratingMax = 10;
        $scope.isReadonly = true;
        $scope.showPercent = false;

        $scope.hoveringOver = function() {
            $scope.percent = 100 * ($scope.mediaModel.tvShowRate / $scope.ratingMax);
            $scope.showPercent = true;
        };

        $scope.ratingStates = [
            {stateOn: 'glyphicon-ok-sign', stateOff: 'glyphicon-ok-circle'},
            {stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty'},
            {stateOn: 'glyphicon-heart', stateOff: 'glyphicon-ban-circle'},
            {stateOn: 'glyphicon-heart'},
            {stateOff: 'glyphicon-off'}
        ];

        //Duplicate existing Tv show
        $scope.duplicateItem = function() {
            $location.path('/tv-shows/create').search({param: $scope.mediaModel._id});
        };

        // Remove existing Tv show
        $scope.remove = function(tvShow) {
            if ( tvShow ) {
                tvShow.$remove();

                for (var i in $scope.tvShows) {
                    if ($scope.tvShows [i] === tvShow) {
                        $scope.tvShows.splice(i, 1);
                    }
                }
            } else {
                $scope.tvShow.$remove(function() {
                    $location.path('tv-shows');
                });
            }
        };

        // Find existing Tv show
        $scope.findOne = function() {
            TvShows.get({ tvShowId: $stateParams.tvShowId }).$promise.then(function (result) {
                if (result.price === null)
                    result.price = undefined;
                $scope.tvShow = result;
                $scope.mediaModel = TvShowsService.fillViewTvShowModel(result);
                $scope.isLoaded = true;
            });
        };
    }
]);
