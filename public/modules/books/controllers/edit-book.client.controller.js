'use strict';

angular.module('books').controller('EditBookController', ['$scope', '$stateParams', '$location', 'Authentication', 'Books', 'BooksDataService',
    function($scope, $stateParams, $location, Authentication, Books, BooksDataService) {
        $scope.authentication = Authentication;
        $scope.ratingMax = 10;
        $scope.isReadonly = false;

        $scope.hoveringOver = function(value) {
            $scope.overStar = value;
        };

        $scope.ratingStates = [
            {stateOn: 'glyphicon-ok-sign', stateOff: 'glyphicon-ok-circle'},
            {stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty'},
            {stateOn: 'glyphicon-heart', stateOff: 'glyphicon-ban-circle'},
            {stateOn: 'glyphicon-heart'},
            {stateOff: 'glyphicon-off'}
        ];

        // Update existing Book
        $scope.update = function() {
            var book = BooksDataService.createBookFromBookModel($scope.mediaModel);
            book._id = $scope.mediaModel._id;
            book.$update(function() {
                $location.path('books/' + book._id);
                $scope.mediaModel = {};
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find existing Book
        $scope.findOne = function() {

            function getOneCallback() {

                $scope.isCustomField = $scope.mediaModel.customFields ? true : false;

                $scope.addField = function(itemList, item) {
                    for (var i = 0; i < $scope.mediaModel[itemList].length; i++) {
                        if ($scope.mediaModel[itemList][i] === $scope.mediaModel[item]) {
                            $scope.mediaModel[item] = '';
                            return;
                        }
                    }
                    $scope.mediaModel[itemList].push($scope.mediaModel[item]);
                    $scope.mediaModel[item] = '';
                };

                $scope.deleteField = function (key, index) {
                    $scope.mediaModel[key].splice(index, 1);
                };

                $scope.checkField = function (key, val) {
                    return val ? ($scope.mediaModel[key] && $scope.mediaModel[key][val] ? false : true) : ($scope.mediaModel[key] ? false : true);
                };

                $scope.updateField = function (key, index, data) {
                    $scope.mediaModel[key][index] = data;
                };

                $scope.addCustomField = function (key, val) {
                    if (!$scope.mediaModel[key]) {
                        $scope.mediaModel[key] = [];
                    }
                    $scope.mediaModel[key].push($scope.mediaModel[val]);
                    $scope.mediaModel[val] = {};
                };

                $scope.checkUpdateVolume = function() {
                    return !$scope.mediaModel.collectionName || $scope.mediaModel.collectionName === '';
                };
            }

            Books.get( { bookId: $stateParams.bookId } ).$promise.then(function(result) {
                $scope.mediaModel = BooksDataService.fillBookModel(result);
                $scope.mediaModel._id = result._id;
                getOneCallback();
            });
        };

        $scope.cancelEditBook = function () {
            $location.path('/books/' + $stateParams.bookId);
        };
    }
]);
