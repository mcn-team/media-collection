'use strict';

angular.module('books').controller('ListBooksController', [
    '$scope', '$location', '$anchorScroll', '$window',
    'Authentication', 'StatsBookService', 'BooksDataService', 'BookServices', 'lodash',
    function($scope, $location, $anchorScroll, $window,
             Authentication, StatisticsService, BooksDataService, BookServices, _) {

        $scope.authentication = Authentication.checkAuth();
        $scope.mediaType = 'Book';

        $scope.goToTop = function () {
            $window.scrollTo(0, 0);
        };

        $scope.goToStats = function() {
            $location.hash('stats');
            $anchorScroll();
        };

        BookServices.getAuthorsNameList().then(function (result) {
            $scope.existingAuthors = result.data;
        });

        BookServices.getCollectionNames().then(function (result) {
            $scope.existingCollections = result.data;
        });

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
                _.forEach($scope.books, function (element) {
                    if (element.summary) {
                        element.truncatedSummary = element.summary.TruncIsh(450);
                    }
                });
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
