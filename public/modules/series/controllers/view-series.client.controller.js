/**
 * Created by Kaze on 02/06/2015.
 */

'use strict';

angular.module('series').controller('SeriesViewController', [
    '$scope', '$stateParams', 'Authentication',
    'Series', 'SeriesDataService',
    function($scope, $stateParams, Authentication, Series, SeriesDataService) {
        $scope.authentication = Authentication.checkAuth();

        // Find existing Series
        $scope.findOne = function() {
            Series.get({ seriesId: $stateParams.seriesId }).$promise.then(function (result) {
                $scope.mediaModel = SeriesDataService.fillModelViewFromSeries(result);
                console.log($scope.mediaModel);
            });
        };
    }
]);
