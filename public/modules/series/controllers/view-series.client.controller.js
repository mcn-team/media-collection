/**
 * Created by Kaze on 02/06/2015.
 */

'use strict';

angular.module('series').controller('SeriesViewController', [
    '$scope', '$stateParams', 'Authentication',
    'SeriesDataService', 'SeriesServices',
    function($scope, $stateParams, Authentication, SeriesDataService, SeriesServices) {
        $scope.authentication = Authentication.checkAuth();

        // Find existing Series
        $scope.findOne = function() {
            SeriesServices.getTvShow($stateParams.seriesId).then(function (response) {
                $scope.mediaModel = SeriesDataService.fillModelViewFromSeries(response.data);
            });
        };
    }
]);
