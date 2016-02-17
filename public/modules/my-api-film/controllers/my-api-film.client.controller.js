'use strict';


angular.module('my-api-film').controller('myApiFilmController', [
    '$scope', '$sce', '$interval', '$timeout','Authentication', 'myApiFilmExposed',
    function($scope, $sce, $interval, $timeout, Authentication, ApiFilmExposed) {
        // This provides Authentication context.
        $scope.authentication = Authentication.checkAuth();

        $scope.ngClass = 'hidden-op';

        $scope.myInterval = 5000;
        $scope.trailers = [];

        $scope.trailerProp = {
            ngClass: '',
            idx: 0,
            isPaused: false
        };

        function changeFeedCallback(feedProperties, isReversed) {
            feedProperties.ngClass = 'feed-fade-out';
            $timeout(function () {
                if (isReversed){
                    if (feedProperties.idx > 0) {
                        feedProperties.idx -= 1;
                    } else {
                        feedProperties.idx = $scope.trailerNbr;
                    }
                } else {
                    if (feedProperties.idx < $scope.trailerNbr) {
                        feedProperties.idx += 1;
                    } else {
                        feedProperties.idx = 0;
                    }
                }
                feedProperties.ngClass = 'feed-fade-in';
            }, 1000);
        }

        $scope.trailerProp.handler = $interval(function () {
            changeFeedCallback($scope.trailerProp);
        }, 12000);

        function pauseResumeFeed(feedProperties) {
            if (feedProperties.isPaused) {
                feedProperties.handler = $interval(function () {
                    changeFeedCallback(feedProperties);
                }, 12000);
            } else {
                $interval.cancel(feedProperties.handler);
            }
            feedProperties.isPaused = !feedProperties.isPaused;
        }

        $scope.pauseFeed = function () {
            pauseResumeFeed($scope.firstFeed);
        };

        $scope.previousFeed = function () {
            changeFeedCallback($scope.trailerProp, true);
        };

        $scope.nextFeed = function () {
            changeFeedCallback($scope.trailerProp);
        };

        $scope.trustSrc = function(src) {
            return $sce.trustAsResourceUrl(src);
        };

        function lastTrailerCallback(result) {
            $scope.trailers = result.trailer;
            $scope.selected = result.trailer[0];
            $scope.ngClass = 'fade-in';
            $scope.trailerNbr = result.trailer.length - 1;
        }

        ApiFilmExposed.lastTrailer(4).$promise.then(function (result) {
            lastTrailerCallback(result);
        });
    }
]);
