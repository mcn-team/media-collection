'use strict';

angular.module('books').controller('ViewBookController', [
    '$scope', '$location', '$stateParams', '$uibModal', '$log', '$timeout',
    'lodash', 'BookServices', 'Authentication', 'BooksDataService',
    function ($scope, $location, $stateParams, $uibModal, $log, $timeout,
        _, BookServices, Authentication, BooksDataService) {
        $scope.authentication = Authentication.checkAuth();
        $scope.ratingMax = 10;
        $scope.isReadonly = true;
        $scope.showPercent = false;

        $scope.hoveringOver = function () {
            $scope.percent = 100 * ($scope.mediaModel.bookRate / $scope.ratingMax);
            $scope.showPercent = true;
        };

        $scope.ratingStates = [
            { stateOn: 'glyphicon-ok-sign', stateOff: 'glyphicon-ok-circle' },
            { stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty' },
            { stateOn: 'glyphicon-heart', stateOff: 'glyphicon-ban-circle' },
            { stateOn: 'glyphicon-heart' },
            { stateOff: 'glyphicon-off' }
        ];

        function openAutoAddModal(size, result) {
            var modal = $uibModal.open({
                templateUrl: 'booksAutoAddClientModal.html',
                controller: 'BookAutoAddController',
                size: size,
                resolve: {
                    BookData: function () {
                        return BooksDataService.createBookFromBookModel($scope.mediaModel);
                    },
                    MissingVolumes: function () {
                        return result;
                    }
                }
            });

            modal.result.then(function () {
                $location.path('/books/collections');
            });
        }

        $scope.addMissing = function (size) {
            BookServices.getCollection($scope.mediaModel.collectionName, $scope.mediaModel.volumeId).then(function (response) {
                var data = {
                    _id: $scope.mediaModel.collectionName,
                    data: response.data
                };
                var result = _.filter(BooksDataService.computeMissing([data], $scope.mediaModel.volumeId)[0].data, function (item) {
                    return !item.title;
                });
                if (result.length > 0) {
                    openAutoAddModal(size, result);
                } else {
                    $scope.showAlert = true;
                    $timeout(function () {
                        $scope.showAlert = false;
                    }, 5000);
                }
            });
        };

        $scope.findOneView = function () {

            $scope.updateStatus = function () {
                var book = BooksDataService.createBookFromBookModel($scope.mediaModel);
                book._id = $scope.book._id;

                var successCallback = function() {};
                var failureCallback = function (errorResponse) {
                    $scope.error = errorResponse.data.message;
                };

                BookServices.updateBook(book._id, book).then(successCallback, failureCallback);
            };

            $scope.duplicateItem = function () {
                $location.path('/books/create').search({ param: $scope.book._id });
            };

            function findBookCallback() {
                var localeOptions = { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 };
                $scope.mediaModel = BooksDataService.fillBookModel($scope.book);
                $scope.book.price = $scope.mediaModel.price ? $scope.mediaModel.price.toLocaleString('fr-FR', localeOptions) : '';
                $scope.isLoaded = true;
            }

            BookServices.getBook($stateParams.bookId).then(function (result) {
                $scope.book = result.data;
                $scope.book._id = result.data._id;
                findBookCallback();
            });
        };

        // Remove existing Book
        $scope.remove = function () {
            BookServices.deleteBook($stateParams.bookId).then(function () {
                $location.path('books');
            });
        };
    }
]);
