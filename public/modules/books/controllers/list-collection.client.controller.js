'use strict';

angular.module('books').controller('ListCollectionController', ['$scope', '$location', 'Authentication', '$anchorScroll', 'StatsBookService', 'BooksExposed',
    function($scope, $location, Authentication, $anchorScroll, StatisticsService, BooksExposed) {
        $scope.authentication = Authentication;
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

            function getCollectionCallback() {
                $scope.collectionTab.sort(function(a, b) { return a.name > b.name ? 1 : -1; });
                $scope.stats = StatisticsService.calculate($scope.collectionTab);
                $scope.isLoaded = true;
            }

            BooksExposed.getCollections().$promise.then(function(result){$scope.collectionTab = result; getCollectionCallback(); });
        };
    }
]);
