'use strict';

angular.module('books').controller('EditBookController', [
    '$scope', '$stateParams', '$location', '$window', 'lodash',
    'Authentication', 'BooksDataService', 'BookServices', 'UploadServices', 'StringHelpers',
    function($scope, $stateParams, $location, $window, _,
             Authentication, BooksDataService, BookServices, UploadServices, StringHelpers) {
        $scope.authentication = Authentication.checkAuth();
        $scope.ratingMax = 10;
        $scope.isReadonly = false;
        $scope.isLoaded = false;
        $scope.isEdit = $stateParams.bookId;
        $scope.mediaModel = {};
        $scope.probableAuthorMisspell = [];
        $scope.probableCollectionMisspell = null;

        var possibleErrors = false;

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
            if (possibleErrors) {
                possibleErrors = false;
                return;
            }

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

        BookServices.getAuthorsNameList().then(function (result) {
            $scope.existingAuthors = result.data;
        });

        // Find existing Book
        $scope.findOne = function() {

            function getOneCallback() {

                $scope.isCustomField = $scope.mediaModel.customFields ? true : false;

                /*
                 * LAST ITEM FUNCTIONS
                 */
                $scope.checkLastItem = function () {
                    if ($scope.mediaModel.lastItem) {
                        $scope.showLastItemAlert = true;
                    }
                };

                $scope.hideLastItem = function () {
                    $scope.showLastItemAlert = false;
                };

                /*
                 * MISS SPELL FUNCTIONS
                 */
                var checkPossibleErrors = function () {
                    return $scope.probableAuthorMisspell.length <= 0 && !$scope.probableCollectionMisspell;
                };

                $scope.removeMisspellWarning = function (index) {
                    _.remove($scope.probableAuthorMisspell, { index: index });
                    possibleErrors = !checkPossibleErrors();
                };

                $scope.replaceAuthors = function (index) {
                    $scope.mediaModel.authorsList[index] = _.find($scope.probableAuthorMisspell, { index: index }).label;
                    _.remove($scope.probableAuthorMisspell, { index: index });
                    possibleErrors = !checkPossibleErrors();
                };

                $scope.getAuthorMisspell = function (index) {
                    return _.find($scope.probableAuthorMisspell, { index: index });
                };

                var checkForAuthorMisspell = function (item, index) {
                    _.forEach($scope.existingAuthors, function (element) {
                        var result = StringHelpers.SimilarText(element, item || $scope.mediaModel.author, true);
                        var misspell = null;

                        if (result > 65 && result < 100 && (!misspell || misspell.percent < result)) {
                            var idx = index === undefined ? $scope.mediaModel.authorsList.length - 1 : index;
                            $scope.probableAuthorMisspell.push({ label: element, percent: result, index: idx });
                            possibleErrors = true;
                        }
                    });
                };

                $scope.removeCollectionMisspellWarning = function () {
                    $scope.probableCollectionMisspell = null;
                    possibleErrors = !checkPossibleErrors();
                };

                $scope.replaceCollection = function () {
                    $scope.mediaModel.collectionName = $scope.probableCollectionMisspell.label;
                    $scope.probableCollectionMisspell = null;
                };

                $scope.getCollectionMisspell = function () {
                    return $scope.probableCollectionMisspell;
                };

                $scope.checkForCollectionMisspell = function () {
                    _.forEach($scope.listExisting, function (element) {
                        var result = StringHelpers.SimilarText(element, $scope.mediaModel.collectionName, true);
                        var misspell = null;

                        if (result > 65 && result < 100 && (!misspell || misspell.percent < result)) {
                            $scope.probableCollectionMisspell = { label: element, percent: result };
                            possibleErrors = true;
                        }
                    });
                };

                $scope.addField = function(itemList, item) {
                    for (var i = 0; i < $scope.mediaModel[itemList].length; i++) {
                        if ($scope.mediaModel[itemList][i] === $scope.mediaModel[item]) {
                            $scope.mediaModel[item] = '';
                            return;
                        }
                    }

                    $scope.mediaModel[itemList].push($scope.mediaModel[item]);

                    checkForAuthorMisspell();

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
                    checkForAuthorMisspell(data, index);
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
