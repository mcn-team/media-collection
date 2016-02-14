'use strict';


angular.module('light-rss-feed').controller('rssFeedController', [
    '$scope', 'Authentication', '$interval', '$timeout',
    'FeedList', 'planeteBDFeedService', 'fnacFeedService',
    function($scope, Authentication, $interval, $timeout, FeedList, planeteBDService, fnacFeedService) {
        // This provides Authentication context.
        $scope.authentication = Authentication.isAuthenticated();
        $scope.feeds = {};
        $scope.feedsProperties = {};

        function changeFeedCallback(feedProperties, isReversed) {
            feedProperties.ngClass = 'feed-fade-out';
            $timeout(function () {
                if (isReversed){
                    if (feedProperties.idx > 0) {
                        feedProperties.idx -= 1;
                    } else {
                        feedProperties.idx = idxFeed;
                    }
                } else {
                    if (feedProperties.idx < idxFeed) {
                        feedProperties.idx += 1;
                    } else {
                        feedProperties.idx = 0;
                    }
                }
                feedProperties.ngClass = 'feed-fade-in';
            }, 1000);
        }

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

        $scope.pauseFeed = function (idx) {
            pauseResumeFeed($scope.feedsProperties[idx]);
        };

        $scope.previousFeed = function (idx) {
            changeFeedCallback($scope.feedsProperties[idx], true);
        };

        $scope.nextFeed = function (idx) {
            changeFeedCallback($scope.feedsProperties[idx]);
        };

        var feeds = FeedList.get();
        var idxFeed = feeds.length - 1;

        //createFeedProp(idxFeed);

        feeds.forEach(function (elem, index) {
            $scope.feedsProperties[elem.title] = {
                ngClass: '',
                handler: null,
                idx: 0,
                isPaused: false
            };

            elem.feed.$promise.then(function (result) {
                $scope.feedsProperties[elem.title].handler = $interval(function () {
                    changeFeedCallback($scope.feedsProperties[elem.title]);
                }, 12000);

                $scope.feeds[elem.title] = result.responseData;
            });
        });

        $scope.parseFnacFeedContent = fnacFeedService.parseFnacFeedContent;
        $scope.formatFeedTitle = planeteBDService.formatFeedTitle;
        $scope.parseRssFeedContent = planeteBDService.parseRssFeedContent;
    }
]);
