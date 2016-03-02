'use strict';

angular.module('books').controller('CreateBookController', [
    '$scope', '$location', '$uibModal', 'Authentication',
    'BookServices', 'BooksDataService',
    function($scope, $location, $uibModal, Authentication, BookServices, BooksDataService) {
        $scope.authentication = Authentication.checkAuth();
        $scope.isLoaded = true;
        $scope.ratingMax = 10;
        $scope.isReadonly = false;
        $scope.isDuplicate = false;
        $scope.searchType = 'google';

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

        $scope.initCreate = function() {
            function cloneCallback(result) {
                $scope.mediaModel = BooksDataService.fillDupBookModel(result.data);
                $scope.isLoaded = true;
                $scope.isCustomField = $scope.mediaModel.customFields ? true : false;
            }

            $scope.addCustomField = function (key, val) {
                if (!$scope.mediaModel[key]) {
                    $scope.mediaModel[key] = [];
                }
                $scope.mediaModel[key].push($scope.mediaModel[val]);
                $scope.mediaModel[val] = {};
            };

            BookServices.getCollectionNames().then(function (result) {
                $scope.listExisting = result.data;
            });

            $scope.mediaModel = {
                authorsList: [],
                custom: {},
                bookRate: 7,
                searchIsbn: null,
                read: 'NOTREAD',
                bought: true
            };
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
            if ($location.search() && $location.search().param) {
                $scope.isDuplicate = true;
                $scope.isLoaded = false;
                BookServices.getBook($location.search().param).then(function(result) {
                    cloneCallback(result);
                });
            }

            //ISBN FIELD
            $scope.checkIsbn = function() {
                return !$scope.mediaModel.searchIsbn || ($scope.mediaModel.searchIsbn.length !== 10 && $scope.mediaModel.searchIsbn.length !== 13);
            };

            $scope.searchByIsbn = function() {
                BookServices.getBookByISBN($scope.mediaModel.searchIsbn).then(function (response) {
                    $scope.mediaModel.isbn = $scope.mediaModel.searchIsbn;
                    $scope.mediaModel = BooksDataService.fillBookModel(response.data);
                }, function (errorResponse) {
                    $scope.error = errorResponse.data.error;
                    console.error(errorResponse);
                });
            };

            $scope.searchByTitle = function () {
                BookServices.wikiSearchByTitle($scope.mediaModel.searchTitle).then(function (response) {
                    var modal = $uibModal.open({
                        templateUrl: 'apiSearchClientModal.html',
                        controller: 'ApiSearchModalController',
                        size: 'lg',
                        resolve: {
                            WikipediaChoices: function () {
                                return response.data;
                            }
                        }
                    });

                    modal.result.then(function (model) {
                        angular.forEach(Object.keys(model), function (current) {
                            $scope.mediaModel[current] = model[current];
                        });
                    });
                });
            };

            //Author fields
            $scope.addAuthorField = function() {
                if (!$scope.mediaModel.authorsList){
                    $scope.mediaModel.authorsList = [];
                }
                for (var i = 0; i < $scope.mediaModel.authorsList.length; i++) {
                    if ($scope.mediaModel.authorsList[i] === $scope.author) {
                        $scope.mediaModel.author = '';
                        return;
                    }
                }
                $scope.mediaModel.authorsList.push($scope.mediaModel.author);
                $scope.mediaModel.author = '';
            };

            // Variables for Type field

            $scope.mediaModel.type = 'book';

            //Volume field

            $scope.checkAddVolume = function() {
                return !$scope.mediaModel.collectionName || $scope.mediaModel.collectionName === '';
            };

        };

        // Validation du formulaire de la page Nouveau Livre

        $scope.validateForm = function() {
            var book = BooksDataService.createBookFromBookModel($scope.mediaModel);
            book.user = $scope.authentication.user._id;
            if (book.collectionName && !book.volume) {
                $scope.error = 'Volume is missing';
                return;
            }

            BookServices.addBook(book).then(function (response) {
                $location.path('books/' + response.data._id);
                $scope.mediaModel = {};
            }, function (errorResponse) {
                console.error(errorResponse);
                $scope.error = errorResponse.data.message;
                $scope.mediaModel.authorsList.pop();
            });
        };

        $scope.cancelPage = function() {
            var tmpUrl = $location.url().split('=')[1];

            if (tmpUrl) {
                delete $location.$$search.param;
                $location.url('/books/' + tmpUrl);
            } else {
                $location.url('/books');
            }
        };
    }
]);
