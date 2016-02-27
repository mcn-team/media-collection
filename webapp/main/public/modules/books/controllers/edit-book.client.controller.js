'use strict';

angular.module('books').controller('EditBookController', [
    '$scope', '$stateParams', '$location',
    'Authentication', 'BooksDataService', 'BookServices',
    function($scope, $stateParams, $location, Authentication, BooksDataService, BookServices) {
        $scope.authentication = Authentication.checkAuth();
        $scope.ratingMax = 10;
        $scope.isReadonly = false;
        $scope.isLoaded = false;
        $scope.isEdit = $stateParams.bookId;

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
        $scope.validateForm = function() {
            var book = BooksDataService.createBookFromBookModel($scope.mediaModel);
            book._id = $scope.mediaModel._id;

            var successUpdateCallback = function (response) {
                $location.path('books/' + book._id);
                $scope.mediaModel = {};
            };

            var failureUpdateCallback = function (errorResponse) {
                $scope.error = errorResponse.data.message;
            };

            BookServices.updateBook(book._id, book).then(successUpdateCallback, failureUpdateCallback);
        };

        BookServices.getCollectionNames().then(function (result) {
            $scope.listExisting = result.data;
        });

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
                $scope.isLoaded = true;
            }

            var successGetBookCallback = function (response) {
                $scope.mediaModel = BooksDataService.fillBookModel(response.data);
                $scope.mediaModel._id = response.data._id;
                getOneCallback();
            };
            var failureGetBookCallback = function (errorResponse) {
                console.error(errorResponse);
                //TODO
            };

            BookServices.getBook($stateParams.bookId).then(successGetBookCallback, failureGetBookCallback);
        };

        $scope.cancelPage = function () {
            $location.path('/books/' + $stateParams.bookId);
        };
    }
]);
