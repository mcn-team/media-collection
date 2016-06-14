'use strict';

angular.module('books').controller('ListBooksController', [
    '$scope', '$location', '$anchorScroll', '$window',
    'Authentication', 'StatsBookService', 'BooksDataService', 'BookServices',
    function($scope, $location, $anchorScroll, $window,
             Authentication, StatisticsService, BooksDataService, BookServices) {

        $scope.authentication = Authentication.checkAuth();
        $scope.mediaType = 'Book';

        $scope.goToStats = function() {
            $location.hash('stats');
            $anchorScroll();
        };

        $scope.updateMode = function () {
            if ($scope.searchParam === 'multi') {
                $window.sessionStorage.removeItem('bookSearchMode');
            } else {
                $window.sessionStorage.setItem('bookSearchMode', 'multi');
            }
            $scope.searchParam = $window.sessionStorage.getItem('bookSearchMode');
        };

        $scope.find = function () {
            $scope.searchParam = $window.sessionStorage.getItem('bookSearchMode');

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
