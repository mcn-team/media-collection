'use strict';

angular.module('books').controller('EditBookController', [
    '$scope', '$stateParams', '$location', '$window',
    'Authentication', 'BooksDataService', 'BookServices', 'UploadServices',
    function($scope, $stateParams, $location, $window, Authentication, BooksDataService, BookServices, UploadServices) {
        $scope.authentication = Authentication.checkAuth();
        $scope.ratingMax = 10;
        $scope.isReadonly = false;
        $scope.isLoaded = false;
        $scope.isEdit = $stateParams.bookId;
        $scope.mediaModel = {};

        $scope.loadFile = function (files) {
            $scope.mediaModel.file = files[0];
            var reader = new FileReader();
            reader.onload = function (evt) {
                $scope.$apply(function ($scope) {
                    $scope.mediaModel.myImage = evt.target.result;
                });
            };
            reader.readAsDataURL(files[0]);
        };

        $scope.hoveringOver = function(value) {
            $scope.overStar = value;
        };

        $scope.mediaType = {
            book: { icon: 'book139.png', next: 'comics' },
            comics: { icon: 'speechbubble17.png', next: 'manga' },
            manga: { icon: 'manga2.png', next: 'book' }
        };
        
        $scope.changeTypeField = function () {
            $scope.mediaModel.type = $scope.mediaType[$scope.mediaModel.type].next;
        };

        $scope.readStatus = {
            NOTREAD: { icon: 'eye48.png', next: 'ONGOING', class: 'btn-danger' },
            ONGOING: { icon: 'open161.png', next: 'READ', class: 'btn-info' },
            READ: { icon: 'view8.png', next: 'NOTREAD', class: 'btn-success' }
        };

        $scope.changeReadStatus = function () {
            $scope.mediaModel.read = $scope.readStatus[$scope.mediaModel.read].next;
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

            var failureCallback = function (errorResponse) {
                $scope.error = errorResponse.data.message;
            };

            var successCallback = function () {
                $location.path('books/' + book._id);
                $scope.mediaModel = {};
            };

            var successUpdateCallback = function () {
                if ($scope.mediaModel.myCroppedImage) {
                    var fd = new $window.FormData();

                    fd.append('filename', book._id);
                    fd.append('base64', $scope.mediaModel.myCroppedImage.split(',')[1]);
                    UploadServices.uploadCover(fd).then(successCallback, failureCallback);
                } else {
                    successCallback();
                }
            };

            BookServices.updateBook(book._id, book).then(successUpdateCallback, failureCallback);
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
                if ($scope.mediaModel.cover === 'covers/' + response.data._id + '.jpg') {
                    delete $scope.mediaModel.cover;
                }
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
