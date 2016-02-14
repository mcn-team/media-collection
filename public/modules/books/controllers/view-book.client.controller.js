'use strict';

angular.module('books').controller('ViewBookController', [
    '$scope', '$location', '$stateParams', '$modal', '$log',
    'lodash', 'BookServices', 'Books', 'Authentication', 'BooksDataService',
    function ($scope, $location, $stateParams, $modal, $log, _, BookServices, Books, Authentication, BooksDataService) {
        $scope.authentication = Authentication;
        $scope.ratingMax = 10;
        $scope.isReadonly = true;
        $scope.showPercent = false;

        $scope.hoveringOver = function() {
            $scope.percent = 100 * ($scope.mediaModel.bookRate / $scope.ratingMax);
            $scope.showPercent = true;
        };

        $scope.ratingStates = [
            {stateOn: 'glyphicon-ok-sign', stateOff: 'glyphicon-ok-circle'},
            {stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty'},
            {stateOn: 'glyphicon-heart', stateOff: 'glyphicon-ban-circle'},
            {stateOn: 'glyphicon-heart'},
            {stateOff: 'glyphicon-off'}
        ];

        function openAutoAddModal(size, result) {
            var modal = $modal.open({
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
            }, function (error) {
                $log.error(error);
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
                    console.log('No missing volumes previous to this one');
                    //TODO if no missing volumes previous to this one
                }
            });
        };

        $scope.findOneView = function() {

            $scope.duplicateItem = function() {
                $location.path('/books/create').search({param: $scope.book._id});
            };

            function findBookCallback() {
                $scope.mediaModel = BooksDataService.fillBookModel($scope.book);
                $scope.isLoaded = true;
            }

            BookServices.getBook($stateParams.bookId).then(function (result) {
                $scope.book = result.data;
                findBookCallback();
            });
        };

        // Remove existing Book
        $scope.remove = function(book) {
            if ( book ) {
                book.$remove();

                for (var i in $scope.books) {
                    if ($scope.books[i] === book) {
                        $scope.books.splice(i, 1);
                    }
                }
            } else {
                $scope.book.$remove(function() {
                    $location.path('books');
                });
            }
        };
    }
]);
