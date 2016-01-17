'use strict';

angular.module('books').controller('CreateBookController', ['$scope', 'Authentication',  '$location', 'Books',
    'BooksDataService', 'BooksExposed', 'WikipediaExposed', '$modal',
    function($scope, Authentication, $location, Books, BookServices, BooksExposed, WikipediaExposed, $modal) {
        $scope.authentication = Authentication;
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
                $scope.mediaModel = BookServices.fillDupBookModel(result);
                $scope.isLoaded = true;
                $scope.isCustomField = $scope.mediaModel.customFields ? true : false;
                console.log($scope.mediaModel);
            }


            $scope.addCustomField = function (key, val) {
                if (!$scope.mediaModel[key]) {
                    $scope.mediaModel[key] = [];
                }
                $scope.mediaModel[key].push($scope.mediaModel[val]);
                $scope.mediaModel[val] = {};
            };

            $scope.listExisting = BooksExposed.getCollectionNames();

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
                Books.get( { bookId: $location.search().param } ).$promise.then(function(result) {
                    cloneCallback(result);
                });
            }

            //ISBN FIELD
            $scope.checkIsbn = function() {
                return !$scope.mediaModel.searchIsbn || ($scope.mediaModel.searchIsbn.length !== 10 && $scope.mediaModel.searchIsbn.length !== 13);
            };

            $scope.searchByIsbn = function() {
                BooksExposed.getBookByISBN( { isbn: $scope.mediaModel.searchIsbn } ).$promise.then(function(result) {
                    if (result.error) {
                        $scope.error = result.error;
                    } else {
                        $scope.mediaModel.isbn = $scope.mediaModel.searchIsbn;
                        $scope.mediaModel = BookServices.fillBookModel(result);
                    }
                });
            };

            $scope.searchByTitle = function () {
                WikipediaExposed.searchByTitle({ typeSearch: 'books', toSearch: $scope.mediaModel.searchTitle }).$promise.then(function (result) {
                    var modal = $modal.open({
                        templateUrl: 'apiSearchClientModal.html',
                        controller: 'ApiSearchModalController',
                        size: 'lg',
                        resolve: {
                            WikipediaChoices: function () {
                                return result;
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

        $scope.create = function() {
            var book = BookServices.createBookFromBookModel($scope.mediaModel);
            console.log(book);
            // Redirect after save
            book.$save(function(response) {
                $location.path('books/' + response._id);

                // Clear form fields
                $scope.mediaModel = {};
            }, function(errorResponse) {
                console.log(errorResponse);
                $scope.error = errorResponse.data.message;
                $scope.mediaModel.authorsList.pop();
            });
        };

        $scope.cancelAddDupBook = function() {
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
