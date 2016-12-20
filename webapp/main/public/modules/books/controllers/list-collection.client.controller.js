'use strict';

angular.module('books').controller('ListCollectionController', [
    '$scope', '$location', '$anchorScroll', '$window', 'Authentication',
    'StatsBookService', 'BookServices', 'BooksDataService',
    function($scope, $location, $anchorScroll, $window, Authentication, StatsBookService, BookServices, BooksDataService) {
        $scope.authentication = Authentication.checkAuth();
        $scope.showCompleted = false;

        $scope.goToTop = function () {
            $window.scrollTo(0, 0);
        };

        $scope.goToStats = function() {
            $location.hash('stats');
            $anchorScroll();
        };

        $scope.findCollection = function() {
            $scope.oneAtTime = true;
            $scope.goTo = function(path) {
                if (path && path !== undefined) {
                    $location.path('/books/' + path);
                }
            };
            $scope.books = [];

            BookServices.getCollectionsList().then(function (result) {
                $scope.collectionsList = BooksDataService.computeMissing(result.data);
                $scope.collectionsList = BooksDataService.setCompletedCollection($scope.collectionsList);
                $scope.stats = StatsBookService.calculate($scope.collectionsList);
                $scope.isLoaded = true;
            });
        };
    }
]);
