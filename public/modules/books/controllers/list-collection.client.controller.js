'use strict';

angular.module('books').controller('ListCollectionController', [
    '$scope', '$location', '$anchorScroll', 'Authentication',
    'StatsBookService', 'BooksExposed', 'BookServices', 'BooksDataService',
    function($scope, $location, $anchorScroll, Authentication, StatsBookService, BooksExposed, BookServices, BooksDataService) {
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
                $scope.stats = StatsBookService.calculate($scope.collectionTab);
                $scope.isLoaded = true;
            }

            BookServices.getCollections().then(function (result) {
                $scope.collectionsList = BooksDataService.computeMissing(result.data);
            });
            BooksExposed.getCollections().$promise.then(function(result){$scope.collectionTab = result; getCollectionCallback(); });
        };
    }
]);
