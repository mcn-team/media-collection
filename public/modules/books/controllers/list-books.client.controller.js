'use strict';

angular.module('books').controller('ListBooksController', ['$scope', '$location', 'Authentication', 'Books', '$anchorScroll', 'BooksExposed', 'StatsBookService', 'BooksDataService',
    function($scope, $location, Authentication, Books, $anchorScroll, BooksExposed, StatisticsService, BooksDataService) {

        $scope.authentication = Authentication;
        $scope.mediaType = 'Book';

        $scope.goToStats = function() {
            $location.hash('stats');
            $anchorScroll();
        };

        $scope.find = function () {
            $scope.multiSearchOn = false;

            Books.query().$promise.then(function (result) {
                $scope.books = result;
                $scope.isLoaded = true;
                $scope.$watch('filteredBooks', function () {
                    $scope.stats = StatisticsService.calculate($scope.filteredBooks);
                }, true);
            });

            $scope.formatAuthors = function (authors) {
                return BooksDataService.getDisplayAuthorsList(authors);
            };

            $scope.restoreList = function () {
                $scope.multiSearch = undefined;
            };
        };
    }
]);
