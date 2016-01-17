'use strict';

// Series controller
angular.module('series').controller('SeriesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Series',
    function($scope, $stateParams, $location, Authentication, Series) {
        $scope.authentication = Authentication;

        // Remove existing Series
        $scope.remove = function(series) {
            if ( series ) {
                series.$remove();

                for (var i in $scope.series) {
                    if ($scope.series [i] === series) {
                        $scope.series.splice(i, 1);
                    }
                }
            } else {
                $scope.series.$remove(function() {
                    $location.path('series');
                });
            }
        };

        // Update existing Series
        $scope.update = function() {
            var series = $scope.series;

            series.$update(function() {
                $location.path('series/' + series._id);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Series
        $scope.find = function() {
            $scope.series = Series.query();
        };

    }
]);
