'use strict';

angular.module('books').controller('ListBooksController', [
    '$scope', '$location', '$anchorScroll',
    'Authentication', 'StatsBookService', 'BooksDataService', 'BookServices',
    function($scope, $location, $anchorScroll, Authentication, StatisticsService, BooksDataService, BookServices) {

        $scope.authentication = Authentication.checkAuth();
        $scope.mediaType = 'Book';

        $scope.goToStats = function() {
            $location.hash('stats');
            $anchorScroll();
        };

        $scope.find = function () {
            $scope.multiSearchOn = false;

            BookServices.getAllBooks().then(function (result) {
                $scope.books = result.data;
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
