'use strict';

angular.module('books').controller('CreateBookController', [
    '$scope', '$location', '$uibModal', '$window', 'Authentication',
    'BookServices', 'BooksDataService', 'UploadServices', 'StringHelpers', 'lodash',
    function($scope, $location, $uibModal, $window, Authentication,
             BookServices, BooksDataService, UploadServices, StringHelpers, _) {
        $scope.authentication = Authentication.checkAuth();
        $scope.isLoaded = true;
        $scope.ratingMax = 10;
        $scope.isReadonly = false;
        $scope.isDuplicate = false;
        $scope.isCollapsed = true;
        $scope.searchType = 'amazon';
        $scope.searchSelected = {};
        $scope.probableAuthorMisspell = [];
        $scope.probableCollectionMisspell = null;

        $scope.uploadCover = false;

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

            BookServices.getAuthorsNameList().then(function (result) {
                $scope.existingAuthors = result.data;
            });

            $scope.mediaModel = {
                authorsList: [],
                custom: {},
                bookRate: 7,
                searchIsbn: null,
                read: 'NOTREAD',
                bought: true
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
            $scope.removeMisspellWarning = function (index) {
                _.remove($scope.probableAuthorMisspell, { index: index });
            };

            $scope.replaceAuthors = function (index) {
                $scope.mediaModel.authorsList[index] = _.find($scope.probableAuthorMisspell, { index: index }).label;
                _.remove($scope.probableAuthorMisspell, { index: index });
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
                    }
                });
            };

            $scope.removeCollectionMisspellWarning = function () {
                $scope.probableCollectionMisspell = null;
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
                    }
                });
            };

            /*
             * AUTHORS FIELD FUNCTIONS
             */
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

            if ($location.search() && $location.search().param) {
                $scope.isDuplicate = true;
                $scope.isLoaded = false;
                BookServices.getBook($location.search().param).then(function(result) {
                    cloneCallback(result);
                });
            }

            $scope.searchByIsbn = function() {
                $scope.isSearching = true;
                $scope.isCollapsed = false;
                BookServices.getBookByISBN($scope.mediaModel.searchIsbn).then(function (response) {
                    $scope.isSearching = false;
                    $scope.searchResponse = response.data;
                    if ($scope.searchResponse.title && $scope.searchResponse.title.length > 0) {
                        $scope.searchSelected.title = $scope.searchResponse.title[$scope.searchResponse.title.length - 1];
                        $scope.searchSelected.collection = $scope.searchResponse.title[0];
                    }

                    if ($scope.searchResponse.volume && $scope.searchResponse.volume.length > 0) {
                        $scope.searchSelected.volume = $scope.searchResponse.volume[0];
                    }

                    if ($scope.searchResponse.price && $scope.searchResponse.price.length > 0) {
                        $scope.searchSelected.price = $scope.searchResponse.price[0];
                    }

                }, function (errorResponse) {
                    $scope.error = errorResponse.data.error;
                    $scope.isSearching = false;
                    $scope.isCollapsed = true;
                    console.error(errorResponse);
                });
            };

            $scope.validateSearch = function () {
                var searchedData = {
                    authors: [$scope.searchResponse.author],
                    cover: $scope.searchResponse.cover,
                    isbn: $scope.mediaModel.searchIsbn,
                    title: $scope.searchSelected.title,
                    collectionName: $scope.searchSelected.collection,
                    volume: $scope.searchSelected.volume,
                    price: $scope.searchSelected.price,
                    publisher: $scope.searchResponse.publisher,
                    pageCount: $scope.searchResponse.pages
                };

                $scope.mediaModel = BooksDataService.fillBookModel(searchedData);
                $scope.cancelSearch();
            };

            $scope.cancelSearch = function () {
                $scope.isCollapsed = true;
                delete $scope.searchResponse;
                $scope.searchSelected = {};
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
            var successCallback = function () {
                $location.path('books/' + $scope.bookId);
                $scope.mediaModel = {};
            };

            var failureCallback = function (errorResponse) {
                console.error(errorResponse);
                $scope.error = errorResponse.data.message;
                $scope.mediaModel.authorsList = [];
            };

            var uploadCallback = function () {
                var edit = { cover: $scope.mediaModel.cover + $scope.bookId + '.jpg' };

                BookServices.updateBook($scope.bookId, edit).then(successCallback, failureCallback);
            };

            var book = BooksDataService.createBookFromBookModel($scope.mediaModel);
            book.user = $scope.authentication.user._id;
            if (book.collectionName && book.volume < 0) {
                $scope.error = 'Volume is missing';
                return;
            }

            if (!book.collectionName && !book.title) {
                $scope.error = 'Fields are empty';
                return;
            }

            BookServices.addBook(book).then(function (response) {
                $scope.bookId = response.data._id;
                if (response.data.cover === 'covers/') {
                    var fd = new $window.FormData();

                    fd.append('filename', $scope.bookId);
                    fd.append('base64', $scope.mediaModel.myCroppedImage.split(',')[1]);
                    UploadServices.uploadCover(fd).then(uploadCallback, failureCallback);
                } else {
                    successCallback();
                }
            }, failureCallback);
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
