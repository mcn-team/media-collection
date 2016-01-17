'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'mediacollection';
	var applicationModuleVendorDependencies = ['ngResource', 'ngCookies',  'ngAnimate',  'ngTouch',  'ngSanitize',  'ui.router', 'ui.bootstrap', 'ui.utils'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();

'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('allocine-api');

'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('books');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('light-rss-feed');

'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('movies');

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('my-api-film');

/**
 * Created by Kaze on 12/02/2015.
 */

'use strict';

String.prototype.TruncIsh = String.prototype.TruncIsh || function (limit) {
    if (this.length < limit) {
        return this;
    }
    return this.substring(0, this.indexOf(' ', limit)) + '...';
};

String.prototype.TruncWord = String.prototype.TruncWord || function (limit) {
    if (this.split(' ').length < limit) {
        return this;
    }
    return this.substring(0, this.split(' ', limit).join(' ').length) + ' ...';
};

String.prototype.ContainsLower = String.prototype.ContainsLower || function (substr) {
    return angular.lowercase(this).indexOf(angular.lowercase(substr)) !== -1;
};

Array.prototype.IsEmptyOrUndefined = Array.prototype.IsEmptyOrUndefined || function () {
    var isEmpty = true;
    angular.forEach(this, function (current) {
        if (current && current !== undefined) {
            isEmpty = false;
        }
    });
    return isEmpty;
};

Array.prototype.ContainsLower = Array.prototype.ContainsLower || function (str) {
    var found = false;
    angular.forEach(this, function (current) {
        if (angular.lowercase(current).ContainsLower(str)) {
            found = true;
        }
    });
    return found;
};

Array.prototype.PushUnique = Array.prototype.PushUnique || function (newItem) {
    var found = false;
    angular.forEach(this, function (current) {
        if (current === newItem) {
            found = true;
        }
    });
    if (!found) {
        this.push(newItem);
    }
};

Array.prototype.Contains = Array.prototype.Contains || function (str) {
    var found = false;
    angular.forEach(this, function (current) {
        if (current === str) {
            found = true;
        }
    });
    return found;
};

'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('tv-shows');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');
'use strict';

angular.module('allocine-api').factory('AlloCineAPIExposed', ['$resource', function($resource) {

    return {

        search: function(toSearch, count, filter) {
            return $resource('api/allocine/:apiAction', {}, {
                search: {
                    method: 'GET',
                    params: {
                        apiAction: 'search',
                        toSearch: toSearch,
                        count: count,
                        filter: filter
                    },
                    isArray: true
                }
            }).search();
        },

        getMediaInfo: function(code, mediaType) {
            return $resource('api/allocine/:apiAction', {}, {
                getMediaInfo: {
                    method: 'GET',
                    params: {
                        apiAction: 'getMediaInfo',
                        code: code,
                        mediaType: mediaType
                    }
                }
            }).getMediaInfo();
        }
    };
}
]);

'use strict';

// Configuring the Articles module
angular.module('books').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Livres', 'books', 'dropdown', '/books(/create)?');
		Menus.addSubMenuItem('topbar', 'books', 'Liste des Livres', 'books');
        Menus.addSubMenuItem('topbar', 'books', 'List Collections de Livre', 'books/collections');
        Menus.addSubMenuItem('topbar', 'books', 'Nouveau Livre', 'books/create');
	}
]);

'use strict';

//Setting up route
angular.module('books').config(['$stateProvider',
	function($stateProvider) {
		// Books state routing
		$stateProvider.
		state('listBookCollections', {
			url: '/books/collections',
			templateUrl: 'modules/books/views/list-collection.client.view.html'
		}).
		state('listBooks', {
			url: '/books',
			templateUrl: 'modules/books/views/list-books.client.view.html'
		}).
		state('createBook', {
			url: '/books/create',
			templateUrl: 'modules/books/views/create-book.client.view.html'
		}).
		state('viewBook', {
			url: '/books/:bookId',
			templateUrl: 'modules/books/views/view-book.client.view.html'
		}).
		state('editBook', {
			url: '/books/:bookId/edit',
			templateUrl: 'modules/books/views/edit-book.client.view.html'
		});
	}
]);

'use strict';

angular.module('books').controller('CreateBookController', ['$scope', 'Authentication',  '$location', 'Books',
	'BooksDataService', 'BooksExposed',
	function($scope, Authentication, $location, Books, BookServices, BooksExposed) {
		$scope.authentication = Authentication;
		$scope.isLoaded = true;
        $scope.ratingMax = 10;
        $scope.isReadonly = false;
        $scope.isDuplicate = false;

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
				$scope.bookModel = BookServices.fillBookModel(result);
				$scope.isLoaded = true;
			}

			$scope.listExisting = BooksExposed.getCollectionNames();

			$scope.bookModel = {};
            $scope.bookModel.bookRate = 7;
            $scope.bookModel.searchIsbn = null;
            if ($location.search() && $location.search().param) {
                $scope.isDuplicate = true;
				$scope.isLoaded = false;
				Books.get( { bookId: $location.search().param } ).$promise.then(function(result) {
                    cloneCallback(result);
                });
			}

			//ISBN FIELD
			$scope.checkIsbn = function() {
				return !$scope.bookModel.searchIsbn || ($scope.bookModel.searchIsbn.length !== 10 && $scope.bookModel.searchIsbn.length !== 13);
			};

			$scope.searchByIsbn = function() {
				BooksExposed.getBookByISBN( { isbn: $scope.bookModel.searchIsbn } ).$promise.then(function(result) {
                    $scope.bookModel.isbn = $scope.bookModel.searchIsbn;
					$scope.bookModel = BookServices.fillBookModel(result);
				});
			};

			//Author fields

			if (!$scope.bookModel.authorsList){
				$scope.bookModel.authorsList = [];
			}

			$scope.deleteAuthorField = function(index) {
				$scope.bookModel.authorsList.splice(index, 1);
			};

			$scope.updateAuthorField = function(idx, newStr) {
				$scope.bookModel.authorsList[idx] = newStr;
			};

			$scope.checkAddAuthor = function() {
				return !$scope.bookModel.author;
			};

			$scope.addAuthorField = function() {
				for (var i = 0; i < $scope.bookModel.authorsList.length; i++) {
					if ($scope.bookModel.authorsList[i] === $scope.author) {
						$scope.bookModel.author = '';
						return;
					}
				}
				$scope.bookModel.authorsList.push($scope.bookModel.author);
				$scope.bookModel.author = '';
			};

			// Variables for Type field

			$scope.bookModel.type = 'book';

			//Volume field

			$scope.checkAddVolume = function() {
				return !$scope.bookModel.collectionName || $scope.bookModel.collectionName === '';
			};

		};

		// Validation du formulaire de la page Nouveau Livre

		$scope.create = function() {
			var book = BookServices.createBookFromBookModel($scope.bookModel);
			// Redirect after save
			book.$save(function(response) {
				$location.path('books/' + response._id);

				// Clear form fields
				$scope.bookModel = {};
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
				$scope.bookModel.authorsList.pop();
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
			var book = BooksDataService.createBookFromBookModel($scope.bookModel);
			book._id = $scope.bookModel._id;
			book.$update(function() {
				$location.path('books/' + book._id);
				$scope.bookModel = {};
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find existing Book
		$scope.findOne = function() {

			function getOneCallback() {

				$scope.addAuthorField = function() {
					for (var i = 0; i < $scope.bookModel.authorsList.length; i++) {
						if ($scope.bookModel.authorsList[i] === $scope.bookModel.author) {
							$scope.bookModel.author = '';
							return;
						}
					}
					$scope.bookModel.authorsList.push($scope.bookModel.author);
					$scope.bookModel.author = '';
				};

				$scope.deleteAuthorField = function(index) {
					$scope.bookModel.authorsList.splice(index, 1);
				};

				$scope.updateAuthorField = function(idx, newStr) {
					$scope.bookModel.authorsList[idx] = newStr;
				};

				$scope.checkUpdateVolume = function() {
					return !$scope.bookModel.collectionName || $scope.bookModel.collectionName === '';
				};
			}

			Books.get( { bookId: $stateParams.bookId } ).$promise.then(function(result) {
				$scope.bookModel = BooksDataService.fillBookModel(result);
				$scope.bookModel._id = result._id;
				getOneCallback();
			});
		};

        $scope.cancelEditBook = function () {
            $location.path('/books/' + $stateParams.bookId);
        };
	}
]);

'use strict';

angular.module('books').controller('ListBooksController', ['$scope', '$location', 'Authentication', 'Books', '$anchorScroll', 'BooksExposed', 'StatsBookService', 'BooksDataService',
	function($scope, $location, Authentication, Books, $anchorScroll, BooksExposed, StatisticsService, BooksDataService) {

		$scope.authentication = Authentication;
		//$scope.filteredBooks = undefined;

		$scope.goToStats = function() {
			$location.hash('stats');
			$anchorScroll();
		};

		$scope.find = function () {
			$scope.multiSearchOn = false;

			Books.query().$promise.then(function (result) {
				$scope.books = result;
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

'use strict';

angular.module('books').controller('ListCollectionController', ['$scope', '$location', 'Authentication', '$anchorScroll', 'StatsBookService', 'BooksExposed',
	function($scope, $location, Authentication, $anchorScroll, StatisticsService, BooksExposed) {
		$scope.authentication = Authentication;
		$scope.goToStats = function() {
			$location.hash('stats');
			$anchorScroll();
		};

		$scope.findCollection = function() {
			$scope.oneAtTime = true;
			$scope.goTo = function(path) {
				if (path && path !== undefined) {
					$location.path('/books/' + path);
				}
			};
			$scope.books = [];

			function getCollectionCallback() {
				$scope.collectionTab.sort(function(a, b) { return a.name > b.name ? 1 : -1; });
				$scope.stats = StatisticsService.calculate($scope.collectionTab);
				$scope.isLoaded = true;
			}

			BooksExposed.getCollections().$promise.then(function(result){$scope.collectionTab = result; getCollectionCallback(); });
		};
	}
]);

'use strict';

angular.module('books').controller('ViewBookController', ['$scope', '$location', '$stateParams', 'Books', 'Authentication', 'BooksDataService',
	function ($scope, $location, $stateParams, Books, Authentication, BookServices) {
		$scope.authentication = Authentication;
        $scope.ratingMax = 10;
        $scope.isReadonly = true;
        $scope.showPercent = false;

        $scope.hoveringOver = function() {
            $scope.percent = 100 * ($scope.bookModel.bookRate / $scope.ratingMax);
            $scope.showPercent = true;
        };

        $scope.ratingStates = [
            {stateOn: 'glyphicon-ok-sign', stateOff: 'glyphicon-ok-circle'},
            {stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty'},
            {stateOn: 'glyphicon-heart', stateOff: 'glyphicon-ban-circle'},
            {stateOn: 'glyphicon-heart'},
            {stateOff: 'glyphicon-off'}
        ];

		$scope.findOneView = function() {

			$scope.duplicateItem = function() {
				$location.path('/books/create').search({param: $scope.book._id});
			};

			function findBookCallback() {
				$scope.bookModel = BookServices.fillBookModel($scope.book);
            }

			Books.get( { bookId: $stateParams.bookId } ).$promise.then(function(result) { $scope.book = result; findBookCallback(); });
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

'use strict';

angular.module('books').filter('listBookFilter', [
	function() {
		return function(ngRepeatItems, searchText) {
			var newBookList = [];

			function chkSearchTextInAuthors(authors, search) {
				for (var i = 0; i < authors.length; i++) {
					if (authors[i] && angular.lowercase(authors[i]).indexOf(angular.lowercase(search)) >= 0) {
						return true;
					}
				}
				return false;
			}

			function checkInfosItem(item, search) {
				return item && angular.lowercase(item).indexOf(angular.lowercase(search)) >= 0;
			}

			angular.forEach(ngRepeatItems, function(item) {
				if (checkInfosItem(item.title, searchText) || checkInfosItem(item.collectionName, searchText) ||
					checkInfosItem(item.publisher, searchText) || chkSearchTextInAuthors(item.authors, searchText)) {

					newBookList.push(item);
				}
			});

			if (!searchText && newBookList.length <= 0)
				newBookList = ngRepeatItems;

			return newBookList;
		};
	}
]);

'use strict';

angular.module('books').filter('MultiSearchFilter', ['MultiSearchValidatorService',
	function(ValidatorService) {
		return function(ngRepeatArray, data) {
			var newBookList = [];
			// Multi search directive logic
			// ...
			var filters = ValidatorService.getFields(data);

			var validators = ValidatorService.getValidators();
			angular.forEach(ngRepeatArray, function (current) {
				var isChecked = true;
				angular.forEach(validators, function (item, idx) {
					if (!item.checker(filters[idx], current[item.key])) {
						isChecked = false;
					}
				});
				if (isChecked) {
					newBookList.PushUnique(current);
				}
			});
			if (filters.IsEmptyOrUndefined() && newBookList.length <= 0) {
				newBookList = ngRepeatArray;
			}

			return newBookList;
		};
	}
]);

'use strict';

angular.module('books').factory('BooksDataService', ['Books',
	function(Books) {
		// Book data service logic
		// ...

		var bookServices = {};

		// Public API

		bookServices.getLimitedAuthorsList = function (array) {
			var limitedAuthorsList = [];
			angular.forEach(array, function(current, idx) {
				if (idx < array.length - 1) {
					limitedAuthorsList.push(current.trim());
				}
			});
			return limitedAuthorsList;
		};

		bookServices.getDisplayAuthorsList = function (array) {
			if (!array || array.length === 0) {
				return '';
			}
			var displayAuthors = '';

			angular.forEach(array, function (item) {
				if (displayAuthors !== '' && item)
					displayAuthors += ', ';
				displayAuthors += item;
			});

			return displayAuthors;
		};

		bookServices.fillBookModel = function (book) {
			return {
				type: book.type ? book.type : 'book',
				title: book.title,
				collectionName: book.collectionName ? book.collectionName : undefined,
				volumeId: parseInt(book.volume) ? parseInt(book.volume) : undefined,
				displayAuthors: bookServices.getDisplayAuthorsList(book.authors),
				authorsList: bookServices.getLimitedAuthorsList(book.authors),
				author: book.author,
				publishingDate: book.publishingDate.split('T')[0],
				isbn: book.isbn,
				publisher: book.publisher,
				pageCount: parseInt(book.pageCount),
				price: parseFloat(book.price),
				read: book.read,
				bought: book.bought,
				cover: book.cover,
                bookRate: book.bookRate,
				summary: book.summary
			};
		};

		bookServices.createBookFromBookModel = function (model) {

			var authorsTab = [];
			angular.forEach(model.authorsList, function (current) {
				authorsTab.push(current);
			});
			if (model.author) {
				authorsTab.push(model.author);
			}
			if (!model.collectionName || model.collectionName === '') {
				model.volumeId = '-';
			}

			return new Books ({
				type: model.type,
				title: model.title,
				collectionName: model.collectionName,
				volume: model.volumeId,
				authors: authorsTab,
				publishingDate: model.publishingDate,
				publisher: model.publisher,
				price: model.price,
				isbn: model.isbn,
				read: model.read,
				bought: model.bought,
				pageCount: model.pageCount,
				cover: model.cover,
                bookRate: model.bookRate,
                summary: model.summary
			});
		};

		return bookServices;
	}
]);

'use strict';

angular.module('books').factory('BooksExposed', ['$resource',
	function($resource) {
		var exposedApi = {};

		exposedApi.lastOne = {
			method: 'GET',
			params: {
				apiAction: 'latest'
			}
		};

		exposedApi.getCollections = {
			method: 'GET',
			isArray: true,
			params: {
				apiAction: 'collections'
			}
		};

		exposedApi.getCollectionNames = {
			method: 'GET',
			isArray: true,
			params: {
				apiAction: 'names'
			}
		};

		exposedApi.getBookByISBN = {
				method: 'GET',
				params: {
					apiAction: 'isbn',
					isbn: '@isbn'
				}
		};
		//exposedApi.getBookByISBN = function (isbn) {
		//	return {
		//			method: 'GET',
		//			params: {
		//				apiAction: 'isbn',
		//				isbn: isbn
		//			}
		//	};
		//};

		return $resource('api/books/:apiAction', {isbn: '@isbn'}, exposedApi);
	}
]);

'use strict';

//Books service used to communicate Books REST endpoints
angular.module('books').factory('Books', ['$resource',
	function($resource) {
		return $resource('books/:bookId', { bookId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

angular.module('books').factory('MultiSearchValidatorService', [
	function() {
		// Multi search validator service logic
		// ...

		var validatorService = {};

		// Public API
		validatorService.getFields = function (multiSearch) {
			return [
				multiSearch.collectionSearch,
				multiSearch.authorSearch ? multiSearch.authorSearch.split(' ') : multiSearch.authorSearch,
				multiSearch.volumeSearch,
				multiSearch.titleSearch,
				multiSearch.publisherSearch,
				multiSearch.dates,
				multiSearch.boughtSearch,
				multiSearch.readSearch,
				multiSearch.pagesSearch,
				multiSearch.prices
			];
		};

		validatorService.getValidators = function () {
			var fieldContains = function (search, key) {
				if (!search) {
					return !search;
				}
				return key.ContainsLower(search);
			};

			var arrayContains = function (search, key) {
				if (!search) {
					return !search;
				}
				var found = true;
				angular.forEach(search, function (current) {
					if (!key.ContainsLower(current)) {
						found = false;
					}
				});
				return found;
			};

			var fieldIsEquals = function (search, key) {
				if (search === undefined || search === '' || search === null) {
					return true;
				}
				return key === search;
			};

			var numericIsEquals = function (search, key) {
				if (search === undefined || search === '' || search === null) {
					return true;
				}
				return parseInt(key) === parseInt(search);
			};

			var numericCheck = function (search, key) {
				if ((!search || !search.start) || (search.type === 'between' && ((!search.start || !search.end) || (search.start > search.end)))) {
					return true;
				}
				if (search.type === 'exact') {
					return search.start === parseInt(key);
				} else if (search.type === 'more') {
					return search.start <= parseInt(key);
				} else if (search.type === 'less') {
					return search.start >= parseInt(key);
				} else {
					return search.start <= parseInt(key) && search.end >= parseInt(key);
				}
			};

			var datesCheck = function (search, key) {
				if ((!search || !search.start) || (search.type === 'between' && ((!search.start || !search.end)))) {
					return true;
				}
				if (search.type === 'exact') {
					return new Date(search.start).getTime() === new Date(key).getTime();
				} else if (search.type === 'since') {
					return new Date(search.start).getTime() <= new Date(key).getTime();
				} else if (search.type === 'before') {
					return new Date(search.start).getTime() >= new Date(key).getTime();
				} else {
					return new Date(search.start).getTime() <= new Date(key).getTime() && new Date(search.end).getTime() >= new Date(key).getTime();
				}
			};

			return [
				{checker: fieldContains, key: 'collectionName'},
				{checker: arrayContains, key: 'authors'},
				{checker: numericIsEquals, key: 'volume'},
				{checker: fieldContains, key: 'title'},
				{checker: fieldContains, key: 'publisher'},
				{checker: datesCheck, key: 'publishingDate'},
				{checker: fieldIsEquals, key: 'bought'},
				{checker: fieldIsEquals, key: 'read'},
				{checker: numericCheck, key: 'pageCount'},
				{checker: numericCheck, key: 'price'}
			];
		};

		return validatorService;
	}
]);

'use strict';

angular.module('books').factory('StatsBookService', [
	function() {
		// Stats book service service logic
		// ...

		var bookResult = {};

		var statService = {};

		var statistics = {};

		var initStatistics = function () {
			statistics = {
				collections: { field: 'Nombre de collection', value: 0 },
				books: { field: 'Nombre de livres', value: 0 },
				booksValue: { field: 'Valeur totale', value: 0 },
				missingValue: { field: 'Valeur non renseignées', value: 0 },
				read: { field: 'Livres terminés', value: 0 },
				onGoing: { field: 'Lecture en cours', value: 0 },
				notRead: { field: 'Livres non lu', value: 0 },
				bought: { field: 'Livres achetés', value: 0 },
				toBought: { field: 'Livres à acheter', value: 0 },
				bookMissing: { field: 'Livres manquant', value: 0 }
			};
		};

		var collectionsRef = [];

		var bookStatistics = function (book) {
			if (book.collectionName && !collectionsRef.Contains(book.collectionName)) {
				collectionsRef.push(book.collectionName);
			}
			if (book.title) {
				statistics.books.value += 1;
			}
			if (book.bought && book.title) {
				if (book.price) {
					statistics.booksValue.value += parseFloat(book.price);
				} else {
					statistics.missingValue.value += 1;
				}
				if (book.read === 'READ') {
					statistics.read.value += 1;
				} else if (book.read === 'ONGOING') {
					statistics.onGoing.value += 1;
				} else {
					statistics.notRead.value += 1;
				}
				statistics.bought.value += 1;
			} else if (book.bought === false && book.title) {
				statistics.toBought.value += 1;
			}

		};

		var collectionsStatistics = function (collection) {
			statistics.bookMissing.value += collection.missing;
			angular.forEach(collection.books, function (current) {
				bookStatistics(current);
			});
		};

		// Public API

		statService.calculate = function (array) {

			function checkStatsCategoryPercents(firstKey, secondKey, thirdKey) {
				var total = statistics[firstKey].percent + statistics[secondKey].percent + (statistics[thirdKey] && statistics[thirdKey].percent ? statistics[thirdKey].percent : 0);
				if (total < 100) {
					if (statistics[firstKey].percent > 0 ) {
						statistics[firstKey].percent += 1;
					} else if (statistics[secondKey].percent > 0) {
						statistics[secondKey].percent += 1;
					} else if (thirdKey && statistics[thirdKey] && statistics[thirdKey].percent && statistics[thirdKey].percent > 0) {
						statistics[thirdKey].percent += 1;
					}
					if (statistics[firstKey].percent + statistics[secondKey].percent + (statistics[thirdKey] && statistics[thirdKey].percent ? statistics[thirdKey].percent : 0) < 100) {
						checkStatsCategoryPercents(secondKey, thirdKey, firstKey);
					}
				}
			}
			function checkPercents() {
				checkStatsCategoryPercents('read', 'onGoing', 'notRead');
				checkStatsCategoryPercents('bought', 'toBought', 'bookMissing');
			}

			initStatistics();
			collectionsRef = [];
			angular.forEach(array, function (current) {
				if (current.title) {
					bookStatistics(current);
				} else {
					collectionsStatistics(current);
				}
			});
			statistics.collections.value = collectionsRef.length;
			statistics.booksValue.value = statistics.booksValue.value.toFixed(2);
			statistics.read.percent = Math.floor(statistics.read.value * 100 / statistics.bought.value);
			statistics.onGoing.percent = Math.floor(statistics.onGoing.value * 100 / statistics.bought.value);
			statistics.notRead.percent = Math.floor(statistics.notRead.value * 100 / statistics.bought.value);
			if (array && array[0] && array[0].title) {
				statistics.bought.percent = Math.floor(statistics.bought.value * 100 / statistics.books.value);
				statistics.toBought.percent = Math.floor(statistics.toBought.value * 100 / statistics.books.value);
			} else {
				statistics.bookMissing.value -= statistics.toBought.value;
				statistics.bought.percent = Math.floor(statistics.bought.value * 100 / (statistics.bought.value + statistics.bookMissing.value + statistics.toBought.value));
				statistics.toBought.percent = Math.floor(statistics.toBought.value * 100 / (statistics.bought.value + statistics.bookMissing.value + statistics.toBought.value));
				statistics.bookMissing.percent = Math.floor(statistics.bookMissing.value * 100 / (statistics.bought.value + statistics.bookMissing.value + statistics.toBought.value));
			}
			checkPercents();
			return statistics;
		};

		return statService;
	}
]);

'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);
'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);
'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'BooksExposed', 'MoviesExposed', 'TvShowsExposed',
	function($scope, Authentication, BooksExposed, MoviesExposed, TvShowsExposed) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		$scope.isLoaded = true;
		$scope.fadeInClass = {
			book: 'hidden-op',
			movie: 'hidden-op',
			show: 'hidden-op'
		};

		function getDisplayList(list) {
			var formatted = '';

			for (var i = 0; i < list.length; i++) {
				if (i > 1) {
					formatted += ', ...';
					break;
				}
				if (formatted !== '' && list[i]) {
					formatted += ', ';
				}
				formatted += list[i];
			}
			return formatted;
		}

		function latestCallback(result, key, type, limit) {
			result[key] = getDisplayList(result[key]);
			result.summary = result.summary ? result.summary.TruncIsh(limit) : null;
			$scope.fadeInClass[type] = 'fade-in';
			return result;
		}

        if ($scope.authentication.user) {
			TvShowsExposed.getLatest().$promise.then(function (result) {
				$scope.lastTvShow = latestCallback(result, 'producers', 'show', 750);
			});

			BooksExposed.lastOne().$promise.then(function(result) {
				$scope.lastBookResult = latestCallback(result, 'authors', 'book', 240);
			});

            MoviesExposed.lastOne().$promise.then(function(result) {
                $scope.lastMovieResult = latestCallback(result, 'actors', 'movie', 240);
            });
		} else {
			$scope.isLoaded = true;
		}
	}
]);

'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
	}
]);
'use strict';

angular.module('light-rss-feed').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
        //
	}
]);

'use strict';


angular.module('light-rss-feed').controller('rssFeedController', ['$scope', 'Authentication', '$interval', '$timeout',
    'FeedList', 'planeteBDFeedService', 'fnacFeedService',
    function($scope, Authentication, $interval, $timeout, FeedList, planeteBDService, fnacFeedService) {
        // This provides Authentication context.
        $scope.authentication = Authentication;
        $scope.feeds = {};
        $scope.feedsProperties = {};

        function changeFeedCallback(feedProperties, isReversed) {
            feedProperties.ngClass = 'feed-fade-out';
            $timeout(function () {
                if (isReversed){
                    if (feedProperties.idx > 0) {
                        feedProperties.idx -= 1;
                    } else {
                        feedProperties.idx = idxFeed;
                    }
                } else {
                    if (feedProperties.idx < idxFeed) {
                        feedProperties.idx += 1;
                    } else {
                        feedProperties.idx = 0;
                    }
                }
                feedProperties.ngClass = 'feed-fade-in';
            }, 1000);
        }

        function pauseResumeFeed(feedProperties) {
            if (feedProperties.isPaused) {
                feedProperties.handler = $interval(function () {
                    changeFeedCallback(feedProperties);
                }, 12000);
            } else {
                $interval.cancel(feedProperties.handler);
            }

            feedProperties.isPaused = !feedProperties.isPaused;
        }

        $scope.pauseFeed = function (idx) {
            pauseResumeFeed($scope.feedsProperties[idx]);
        };

        $scope.previousFeed = function (idx) {
            changeFeedCallback($scope.feedsProperties[idx], true);
        };

        $scope.nextFeed = function (idx) {
            changeFeedCallback($scope.feedsProperties[idx]);
        };

        var feeds = FeedList.get();
        var idxFeed = feeds.length - 1;

        //createFeedProp(idxFeed);

        feeds.forEach(function (elem, index) {
            $scope.feedsProperties[elem.title] = {
                ngClass: '',
                handler: null,
                idx: 0,
                isPaused: false
            };

            elem.feed.$promise.then(function (result) {
                $scope.feedsProperties[elem.title].handler = $interval(function () {
                    changeFeedCallback($scope.feedsProperties[elem.title]);
                }, 12000);

                $scope.feeds[elem.title] = result.responseData;
            });
        });

        $scope.parseFnacFeedContent = fnacFeedService.parseFnacFeedContent;
        $scope.formatFeedTitle = planeteBDService.formatFeedTitle;
        $scope.parseRssFeedContent = planeteBDService.parseRssFeedContent;
    }
]);

'use strict';

angular.module('light-rss-feed').factory('fnacFeedService', [
    function() {
        var fnacFeedService = {};

        fnacFeedService.parseFnacFeedContent = function (htmlContent) {
            var fragment = [];

            function regexExtract(str, delimiter) {
                var regX = new RegExp(delimiter + '(.*?)' + delimiter);

                return str.match(regX)[1];
            }

            if (htmlContent) {
                htmlContent = htmlContent.trim();
                htmlContent = htmlContent.replace(/\t/g, '');
                fragment = htmlContent.split('\n');

                for (var i = 0; i < fragment.length; i++) {
                    fragment[i] = fragment[i].trim();
                }

                fragment = fragment.filter(Boolean);
            }

            function fillFeedObjectFields() {
                var item = {};

                fragment.forEach(function (elem, index) {
                    if (elem.indexOf('><img') !== -1) {
                        item.img = regexExtract(elem.split('>')[1], '"');
                        item.link = regexExtract(elem, '"');
                    } else if (elem.indexOf('text-align:justify') !== -1) {
                        item.description = elem.replace(/<[^>]*>/g, '');
                    } else if (elem.indexOf('p><br') !== -1) {
                        item.title = elem.replace(/<[^>]*>/g, '');
                    } else if (elem.indexOf('span><br') !== -1) {
                        item.price = elem.replace(/<[^>]*>/g, '');
                    }
                });

                return item;
            }

            return fillFeedObjectFields();
        };

        return fnacFeedService;
    }
]);

'use strict';

angular.module('light-rss-feed')
    .factory('FeedLoader', ['$resource',
    function($resource) {
        return $resource('http://ajax.googleapis.com/ajax/services/feed/load', {}, {
            fetch: { method: 'JSONP', params: {v: '1.0', callback: 'JSON_CALLBACK'} }
        });
    }
    ])
    .service('FeedList', ['$rootScope', 'FeedLoader',
        function($rootScope, FeedLoader) {
            var FeedListService = {
                feeds: []
            };

            function pushFeedData(data) {
                var feed = data.responseData.feed;
                FeedListService.feeds.push(feed);
            }

            FeedListService.get = function() {
                FeedListService.feeds = [];

                var feedSources = [
                    { title: 'sortie_bd', url: 'http://feeds.feedburner.com/PlaneteBdLight-ChroniquesFranco-belges' },
                    { title: 'sortie_manga', url: 'http://feeds.feedburner.com/PlaneteBdLight-ChroniquesMangas' },
                    { title: 'sortie_film', url: 'http://www4.fnac.com/Rss/Rss.aspx?NID=2074821'},
                    { title: 'sortie_series', url: 'http://www4.fnac.com/Rss/Rss.aspx?NID=1476377'}
                ];

                if (FeedListService.feeds.length === 0) {
                    var allFeeds = [];

                    for (var i = 0; i < feedSources.length; i++) {
                        allFeeds.push( {
                            title: feedSources[i].title,
                            feed: FeedLoader.fetch( { q: feedSources[i].url, num: 10 }, {}, pushFeedData)
                        } );
                    }

                    return allFeeds;
                }
            };

            return FeedListService;
        }

    ]);


'use strict';

angular.module('light-rss-feed').factory('planeteBDFeedService', [
    function() {
        var planeteBDFeedService = {};

        planeteBDFeedService.authorField = '';

        planeteBDFeedService.parseRssFeedContent = function (htmlContent) {
            var tmp = '';
            var fragment = [];

            // Clean html content string.
            if (htmlContent) {
                htmlContent = htmlContent.replace(/(<i>|<\/i>)/g, '');
                htmlContent = htmlContent.replace(/(\. \.)/g, '.');

                for (var i = 0; i < htmlContent.length; i++) {
                    if (htmlContent[i] === '<') {
                        if (tmp !== '') {
                            fragment.push(tmp);
                            tmp = '';
                        }

                        tmp = '';
                    } else if (htmlContent[i] === '>') {
                        tmp += htmlContent[i];
                        fragment.push(tmp);
                        tmp = '';
                    }

                    if (htmlContent[i] !== '>')
                        tmp += htmlContent[i];
                }
            }

            function regexExtract(str, delimiter) {
                var regX = new RegExp(delimiter + '(.*?)' + delimiter);

                return str.match(regX)[1];
            }

            function getImgScr(htmlImgStr) {
                return regexExtract(htmlImgStr, '"');
            }

            function fillFeedObjectFields() {
                var item = {};

                fragment.forEach(function (elem, index, array) {
                    if (elem.indexOf('Auteurs') !== -1) {
                        item.author = elem;
                    } else if (elem.indexOf('<img src="http') !== -1) {
                        item.img = regexExtract(elem, '"');
                    } else if (!/\//.test(elem) && elem.length > 50) {
                        item.summary = elem;
                    }
                });

                return item;
            }

            return fillFeedObjectFields();
        };

        planeteBDFeedService.formatFeedTitle = function (rssTitle) {
            var tmp = [];

            if (rssTitle)
                tmp = rssTitle.split(' - ');

            if (tmp.length === 2) {
                if (tmp[1].length <= 2) {
                    rssTitle = tmp[0] + ' - ' + tmp[1].toUpperCase();
                } else {
                    rssTitle = tmp[0] + ' - ' + tmp[1].charAt(0).toUpperCase() + tmp[1].substring(1);
                }
            }

            return rssTitle;
        };

       return planeteBDFeedService;
    }
]);

'use strict';

// Configuring the Articles module
angular.module('movies').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Films', 'movies', 'dropdown', '/movies(/create)?');
		Menus.addSubMenuItem('topbar', 'movies', 'Liste des Films', 'movies');
        Menus.addSubMenuItem('topbar', 'movies', 'Liste Collections de Film', 'movies/collections');
        Menus.addSubMenuItem('topbar', 'movies', 'Nouveau Film', 'movies/create');
	}
]);

'use strict';

//Setting up route
angular.module('movies').config(['$stateProvider',
	function($stateProvider) {
		// Videos state routing
		$stateProvider.
        state('listMovieCollections', {
            url: '/movies/collections',
            templateUrl: 'modules/movies/views/list-movie-collection.client.view.html'
        }).
		state('listMovies', {
			url: '/movies',
			templateUrl: 'modules/movies/views/list-movies.client.view.html'
		}).
		state('createMovie', {
			url: '/movies/create',
			templateUrl: 'modules/movies/views/create-movie.client.view.html'
		}).
		state('viewMovie', {
			url: '/movies/:movieId',
			templateUrl: 'modules/movies/views/view-movie.client.view.html'
		}).
		state('editMovie', {
			url: '/movies/:movieId/edit',
			templateUrl: 'modules/movies/views/edit-movie.client.view.html'
		});
	}
]);

'use strict';

// Movies controller
angular.module('movies').controller('CreateMoviesController', ['$scope', '$stateParams', '$location', '$modal', '$log', 'Authentication', 'Movies',
    'AlloCineAPIExposed', 'TypesMovieService', 'MovieDataService',
    function($scope, $stateParams, $location, $modal, $log, Authentication, Movies, AlloCineExposed, TypesMovieService, MovieDataService) {
        $scope.authentication = Authentication;
        $scope.isLoaded = true;
        $scope.isDuplicate = false;
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

        $scope.initCreate = function () {
            function cloneCallback(result) {
                $scope.movieModel = MovieDataService.fillMovieModel(result);
                $scope.isLoaded = true;
                $scope.isDuplicate = true;
            }

            $scope.movieModel = {};
            $scope.movieModel.movieRate = 7;
            if ($location.search() && $location.search().param) {
                $scope.isLoaded = false;
                Movies.get(
                    { movieId: $location.search().param } )
                    .$promise
                    .then(function(result) {
                        cloneCallback(result);
                    });
            }

            // Bought field
            $scope.movieModel.bought = true;

            // Seen field
            $scope.movieModel.seen = false;

            // Init Movie Model Lists
            $scope.movieModel = MovieDataService.initMovieModelLists($scope.movieModel, 'actorsList');
            $scope.movieModel = MovieDataService.initMovieModelLists($scope.movieModel, 'producersList');
            $scope.movieModel = MovieDataService.initMovieModelLists($scope.movieModel, 'directorsList');
            $scope.movieModel = MovieDataService.initMovieModelLists($scope.movieModel, 'scenaristsList');

            // Variables for Type field
            if (!$scope.movieModel.typeList) {
                $scope.movieModel.typeList = TypesMovieService.getTypes();
                $scope.movieModel.selectedType = $scope.movieModel.typeList[0];
            }

            $scope.updateField = function(idx, newStr, itemList) {
                $scope.movieModel[itemList][idx] = newStr;
            };

            $scope.deleteField = function(index, itemList) {
                $scope.movieModel[itemList].splice(index, 1);
            };

            $scope.checkAdd = function(type) {
                return !$scope.movieModel[type];
            };

            $scope.addField = function(itemList, item) {
                for (var i = 0; i < $scope.movieModel[itemList].length; i++) {
                    if ($scope.movieModel[itemList][i] === $scope[item]) {
                        $scope.movieModel[item] = '';
                        return;
                    }
                }

                $scope.movieModel[itemList].push($scope.movieModel[item]);
                $scope.movieModel[item] = '';
            };

            //Episode field
            $scope.checkAddEpisode = function() {
                return !$scope.movieModel.collectionName || $scope.movieModel.collectionName === '';
            };
        };


        // Create new Movie
        $scope.create = function() {
            // Create new Movie object
            var movie = MovieDataService.createMovieFromMovieModel($scope.movieModel);

            // Redirect after save
            movie.$save(function(response) {
                $location.path('/movies/' + response._id);

                // Clear form fields
                $scope.movieModel = {};
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
                $scope.movieModel.actorsList.pop();
                $scope.movieModel.producersList.pop();
                $scope.movieModel.directorsList.pop();
                $scope.movieModel.scenaristsList.pop();
            });
        };

        $scope.cancelAddDupMovie = function() {
            var tmpUrl = $location.url().split('=')[1];

            if (tmpUrl) {
                delete $location.$$search.param;
                $location.url('/movies/' + tmpUrl);
            } else {
                $location.url('/movies');
            }
        };

        $scope.searchFilmByTitle = function () {
            function searchCallback(result) {
                //console.log(result);
                $scope.movieList = result;
                $scope.open();
            }

            AlloCineExposed.search($scope.movieModel.searchMovie, 20, 'movie').$promise.then(function(result) {
                searchCallback(result);
            });
        };

        function fillMovieField(item) {
            $scope.movieModel.title = item.title || item.originalTitle;
            $scope.movieModel.summary = item.summary;
            $scope.movieModel.duration = item.duration;
            $scope.movieModel.releasedDate = item.releaseDate;
            $scope.movieModel.cover = item.coverHref;
            $scope.movieModel.actorsList = item.actors;
            $scope.movieModel.directorsList = item.directors;
            $scope.movieModel.producersList = item.producers;
            $scope.movieModel.scenaristsList = item.scenarists;
            $scope.movieModel.searchMovie = '';
        }

        $scope.open = function (size) {

            var modalInstance = $modal.open({
                templateUrl: 'searchMovieModalContent.html',
                controller: 'searchMovieModalController',
                size: size,
                resolve: {
                    movieList: function () {
                        return $scope.movieList;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                fillMovieField(selectedItem);
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
                $scope.movieModel.searchMovie = '';
            });
        };
    }
]);

'use strict';

// Movies controller
angular.module('movies').controller('EditMoviesController', ['$scope', '$stateParams', '$location', 'Authentication', 'MovieDataService', 'Movies',
    function($scope, $stateParams, $location, Authentication, MovieDataService, Movies) {
        $scope.authentication = Authentication;
        $scope.isLoaded = false;
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

        // Update existing Movie
        $scope.update = function() {
            var movie = MovieDataService.createMovieFromMovieModel($scope.movieModel);

            movie._id = $scope.movieModel._id;

            movie.$update(function() {
                $location.path('movies/' + movie._id);
                $scope.movieModel = {};
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find existing Movie
        $scope.findOne = function() {

            function getOneCallback() {
                $scope.updateField = function(idx, newStr, itemList) {
                    $scope.movieModel[itemList][idx] = newStr;
                };

                $scope.deleteField = function(index, itemList) {
                    $scope.movieModel[itemList].splice(index, 1);
                };

                $scope.checkAdd = function(type) {
                    return !$scope.movieModel[type];
                };

                $scope.addField = function(itemList, item) {
                    for (var i = 0; i < $scope.movieModel[itemList].length; i++) {
                        if ($scope.movieModel[itemList][i] === $scope[item]) {
                            $scope.movieModel[item] = '';
                            return;
                        }
                    }

                    $scope.movieModel[itemList].push($scope.movieModel[item]);
                    $scope.movieModel[item] = '';
                };

                $scope.isLoaded = true;
            }

            Movies.get( { movieId: $stateParams.movieId } ).$promise.then(function (result) {
                $scope.movieModel = MovieDataService.fillMovieModel(result);
                $scope.movieModel._id = result._id;
                getOneCallback();
            });
        };

        $scope.cancelEditMovie = function () {
            $location.path('/movies/' + $stateParams.movieId);
        };
    }
]);

'use strict';

angular.module('movies').controller('ListMovieCollectionController', ['$scope', '$location', 'Authentication', '$anchorScroll', 'StatsMovieService', 'MoviesExposed',
    function($scope, $location, Authentication, $anchorScroll, StatsMovieService, MoviesExposed) {
        $scope.authentication = Authentication;

        $scope.goToStats = function() {
            $location.hash('stats');
            $anchorScroll();
        };

        $scope.findCollection = function() {
            $scope.oneAtTime = true;
            $scope.goTo = function(path) {
                if (path && path !== undefined) {
                    $location.path('/movies/' + path);
                }
            };

            $scope.movies = [];

            function getCollectionCallback() {
                $scope.collectionTab.sort(function(a, b) { return a.name > b.name ? 1 : -1; });
                $scope.stats = StatsMovieService.calculate($scope.collectionTab);
                $scope.isLoaded = true;
            }

            MoviesExposed.getCollections().$promise.then(function(result) {
                $scope.collectionTab = result;
                getCollectionCallback();
            });
        };
    }
]);

'use strict';

angular.module('movies').controller('ListMoviesController', ['$scope', '$location', '$anchorScroll', 'Authentication', 'StatsMovieService', 'MovieDataService', 'Movies',
    function($scope, $location, $anchorScroll, Authentication, StatsMovieService, MovieDataService, Movies) {

        $scope.authentication = Authentication;

        $scope.goToStats = function() {
            $location.hash('stats');
            $anchorScroll();
        };

        // Find a list of Movies
        $scope.find = function() {
            $scope.multiSearchOn = false;

            Movies.query().$promise.then(function (result) {
                $scope.movies = result;
                $scope.isLoaded = true;
                $scope.$watch('filteredMovies', function () {
                    $scope.stats = StatsMovieService.calculate($scope.filteredMovies);
                }, true);
            });

            $scope.formatPeople = function (people) {
                return MovieDataService.getDisplayList(people);
            };

            $scope.restoreList = function () {
                $scope.multiSearch = undefined;
            };
        };
    }
]);

'use strict';

angular.module('movies').controller('searchMovieModalController', ['$scope', '$modalInstance', 'movieList', 'AlloCineAPIExposed',
    function ($scope, $modalInstance, movieList, AlloCineExposed) {
        $scope.isCollapsed = true;
        $scope.nothingFound = false;

        if (movieList[0].error) {
            $scope.nothingFound = true;
            $scope.stringSearched = movieList[0].searchReq;
        } else {
            $scope.movieList = movieList;
            $scope.selected = {
                movie: $scope.movieList[0]
            };
        }

        $scope.getMovieInfo = function (movie) {
            $scope.selected.movie = movie;

            function movieInfoCallback(result) {
                $scope.selected.movie.scenarists = result.scenarists;
                $scope.selected.movie.producers = result.producers;
                $scope.selected.movie.duration = result.duration;
                $scope.selected.movie.summary = result.summary.replace(/<[^>]*>/g, '');
                $scope.selected.movie.shortSummary = result.shortSummary.replace(/<[^>]*>/g, '');
                $scope.isCollapsed = false;
            }

            AlloCineExposed.getMediaInfo(movie.code, 'movie').$promise.then(function(result) {
                movieInfoCallback(result);
            });
        };

        $scope.ok = function () {
            $modalInstance.close($scope.selected.movie);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
]);

'use strict';

// View Movie controller
angular.module('movies').controller('ViewMoviesController', ['$scope', '$stateParams', '$location', 'Authentication', 'MovieDataService', 'Movies',
    function($scope, $stateParams, $location, Authentication, MovieDataService, Movies) {
        $scope.authentication = Authentication;
        $scope.ratingMax = 10;
        $scope.isReadonly = true;
        $scope.showPercent = false;

        $scope.hoveringOver = function() {
            $scope.percent = 100 * ($scope.movieModel.movieRate / $scope.ratingMax);
            $scope.showPercent = true;
        };

        $scope.ratingStates = [
            {stateOn: 'glyphicon-ok-sign', stateOff: 'glyphicon-ok-circle'},
            {stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty'},
            {stateOn: 'glyphicon-heart', stateOff: 'glyphicon-ban-circle'},
            {stateOn: 'glyphicon-heart'},
            {stateOff: 'glyphicon-off'}
        ];

        // Find existing Movie
        $scope.findOneView = function() {
            $scope.duplicateItem = function() {
                $location.path('/movies/create').search({param: $scope.movie._id});
            };

            function findMovieCallback() {
                $scope.movieModel = MovieDataService.fillMovieModel($scope.movie);
            }

            Movies.get({
                movieId: $stateParams.movieId
            }).$promise.then(function(result) {
                    $scope.movie = result;
                    findMovieCallback();
                });
        };

        // Remove existing Movie
        $scope.remove = function(movie) {
            if ( movie ) {
                movie.$remove();

                for (var i in $scope.movies) {
                    if ($scope.movies [i] === movie) {
                        $scope.movies.splice(i, 1);
                    }
                }
            } else {
                $scope.movie.$remove(function() {
                    $location.path('movies');
                });
            }
        };
    }
]);

'use strict';

angular.module('movies').filter('listMovieFilter', [
    function() {
        return function(ngRepeatItems, searchText) {
            var newMovieList = [];

            function chkSearchText(people, search) {
                for (var i = 0; i < people.length; i++) {
                    if (people[i] && angular.lowercase(people[i]).indexOf(angular.lowercase(search)) >= 0) {
                        return true;
                    }
                }
                return false;
            }

            function checkInfosItem(item, search) {
                return item && angular.lowercase(item).indexOf(angular.lowercase(search)) >= 0;
            }

            angular.forEach(ngRepeatItems, function(item) {
                if (checkInfosItem(item.title, searchText) || checkInfosItem(item.collectionName, searchText) ||
                    chkSearchText(item.actors, searchText) || chkSearchText(item.producers, searchText) ||
                    chkSearchText(item.directors, searchText) || chkSearchText(item.scenarists, searchText)) {

                    newMovieList.push(item);
                }
            });

            if (!searchText && newMovieList.length <= 0)
                newMovieList = ngRepeatItems;

            return newMovieList;
        };
    }
]);

'use strict';

angular.module('movies').filter('MultiSearchMovieFilter', ['MultiSearchMovieValidatorService',
    function(MovieValidatorService) {
        return function(ngRepeatArray, data) {
            var newMovieList = [];

            var filters = MovieValidatorService.getFields(data);

            var validators = MovieValidatorService.getValidators();
            angular.forEach(ngRepeatArray, function (current) {
                var isChecked = true;
                angular.forEach(validators, function (item, idx) {
                    if (!item.checker(filters[idx], current[item.key])) {
                        isChecked = false;
                    }
                });
                if (isChecked) {
                    newMovieList.PushUnique(current);
                }
            });
            if (filters.IsEmptyOrUndefined() && newMovieList.length <= 0) {
                newMovieList = ngRepeatArray;
            }

            return newMovieList;
        };
    }
]);

'use strict';

angular.module('movies').factory('MovieDataService', ['TypesMovieService', 'Movies',
    function(TypeService, Movies) {

        var movieServices = {};

        function pushPeopleToTab(list, item) {
            var itemsTab = [];

            angular.forEach(list, function (current) {
                itemsTab.push(current);
            });

            if (item) {
                itemsTab.push(item);
            }

            return itemsTab;
        }

        movieServices.initMovieModelLists = function(movieModel, list) {
            if (!movieModel[list]) {
                movieModel[list] = [];
            }

            return movieModel;
        };

        movieServices.getLimitedList = function (array) {
            var limitedList = [];

            angular.forEach(array, function(current, idx) {
                if (idx < array.length - 1) {
                    limitedList.push(current.trim());
                }
            });

            return limitedList;
        };

        movieServices.getDisplayList = function (array) {
            if (!array || array.length === 0) {
                return '';
            }
            var displayList = '';

            angular.forEach(array, function (item) {
                if (displayList !== '' && item)
                    displayList += ', ';
                displayList += item;
            });

            return displayList;
        };

        movieServices.fillMovieModel = function (movie) {
            return {
                typeList: TypeService.getTypes(),
                seen: movie.seen,
                selectedType: TypeService.getType(movie.type),
                title: movie.title,
                collectionName: movie.collectionName ? movie.collectionName : undefined,
                episode: parseInt(movie.episode) ? parseInt(movie.episode) : undefined,
                displayActors: movieServices.getDisplayList(movie.actors),
                actorsList: movieServices.getLimitedList(movie.actors),
                actor: movie.actors[movie.actors.length - 1],
                displayProducers: movieServices.getDisplayList(movie.producers),
                producersList: movieServices.getLimitedList(movie.producers),
                producer: movie.producers[movie.producers.length - 1],
                displayDirectors: movieServices.getDisplayList(movie.directors),
                directorsList: movieServices.getLimitedList(movie.directors),
                director: movie.directors[movie.directors.length - 1],
                displayScenarists: movieServices.getDisplayList(movie.scenarists),
                scenaristsList: movieServices.getLimitedList(movie.scenarists),
                scenarist: movie.scenarists[movie.scenarists.length - 1],
                releasedDate: movie.releasedDate ? movie.releasedDate.split('T')[0] : undefined,
                duration: parseInt(movie.duration),
                price: parseFloat(movie.price),
                bought: movie.bought,
                cover: movie.cover,
                movieRate: movie.movieRate,
                summary: movie.summary
            };
        };

        movieServices.createMovieFromMovieModel = function (model) {
            var actorsTab = pushPeopleToTab(model.actorsList, model.actor);
            var producersTab = pushPeopleToTab(model.producersList, model.producer);
            var directorsTab = pushPeopleToTab(model.directorsList, model.director);
            var scenaristsTab = pushPeopleToTab(model.scenaristsList, model.scenarist);

            if (!model.collectionName || model.collectionName === '') {
                model.episode = 0;
            }

            return new Movies ({
                type: model.selectedType ? model.selectedType.value : '',
                title: model.title,
                collectionName: model.collectionName,
                episode: model.episode,
                actors: actorsTab,
                producers: producersTab,
                directors: directorsTab,
                scenarists: scenaristsTab,
                releasedDate: model.releasedDate,
                price: model.price,
                seen: model.seen,
                bought: model.bought,
                duration: model.duration,
                cover: model.cover,
                movieRate: model.movieRate,
                summary: model.summary
            });
        };

        return movieServices;
    }
]);

'use strict';

angular.module('movies').factory('MoviesExposed', ['$resource',
    function($resource) {
        return $resource('api/movies/:apiAction', {
        }, {
            lastOne: {
                method: 'GET',
                params: {
                    apiAction: 'latest'
                }
            },
            getCollections: {
                method: 'GET',
                isArray: true,
                params: {
                    apiAction: 'collections'
                }
            },
            getCollectionNames: {
                method: 'GET',
                isArray: true,
                params: {
                    apiAction: 'names'
                }
            }
        });
    }
]);

'use strict';

//Videos service used to communicate Videos REST endpoints
angular.module('movies').factory('Movies', ['$resource',
	function($resource) {
		return $resource('movies/:movieId', { movieId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

angular.module('movies').factory('MultiSearchMovieValidatorService', [
    function() {
        var validatorService = {};

        // Public API
        validatorService.getFields = function (multiSearch) {
            return [
                multiSearch.collectionSearch,
                multiSearch.actorSearch ? multiSearch.actorSearch.split(' ') : multiSearch.actorSearch,
                multiSearch.producerSearch ? multiSearch.producerSearch.split(' ') : multiSearch.producerSearch,
                multiSearch.directorSearch ? multiSearch.directorSearch.split(' ') : multiSearch.directorSearch,
                multiSearch.scenaristSearch ? multiSearch.scenaristSearch.split(' ') : multiSearch.scenaristSearch,
                multiSearch.episodeSearch,
                multiSearch.titleSearch,
                multiSearch.dates,
                multiSearch.boughtSearch,
                multiSearch.seenSearch,
                multiSearch.durationSearch,
                multiSearch.prices
            ];
        };

        validatorService.getValidators = function () {
            var fieldContains = function (search, key) {
                if (!search) {
                    return !search;
                }
                return key.ContainsLower(search);
            };

            var arrayContains = function (search, key) {
                if (!search) {
                    return !search;
                }
                var found = true;
                angular.forEach(search, function (current) {
                    if (!key.ContainsLower(current)) {
                        found = false;
                    }
                });
                return found;
            };

            var fieldIsEquals = function (search, key) {
                if (search === undefined || search === '' || search === null) {
                    return true;
                }
                return key === search;
            };

            var numericIsEquals = function (search, key) {
                if (search === undefined || search === '' || search === null) {
                    return true;
                }
                return parseInt(key) === parseInt(search);
            };

            var numericCheck = function (search, key) {
                if ((!search || !search.start) || (search.type === 'between' && ((!search.start || !search.end) || (search.start > search.end)))) {
                    return true;
                }
                if (search.type === 'exact') {
                    return search.start === parseInt(key);
                } else if (search.type === 'more') {
                    return search.start <= parseInt(key);
                } else if (search.type === 'less') {
                    return search.start >= parseInt(key);
                } else {
                    return search.start <= parseInt(key) && search.end >= parseInt(key);
                }
            };

            var datesCheck = function (search, key) {
                if ((!search || !search.start) || (search.type === 'between' && ((!search.start || !search.end)))) {
                    return true;
                }
                if (search.type === 'exact') {
                    return new Date(search.start).getTime() === new Date(key).getTime();
                } else if (search.type === 'since') {
                    return new Date(search.start).getTime() <= new Date(key).getTime();
                } else if (search.type === 'before') {
                    return new Date(search.start).getTime() >= new Date(key).getTime();
                } else {
                    return new Date(search.start).getTime() <= new Date(key).getTime() && new Date(search.end).getTime() >= new Date(key).getTime();
                }
            };

            return [
                {checker: fieldContains, key: 'collectionName'},
                {checker: arrayContains, key: 'actors'},
                {checker: arrayContains, key: 'producers'},
                {checker: arrayContains, key: 'directors'},
                {checker: arrayContains, key: 'scenarists'},
                {checker: numericIsEquals, key: 'episode'},
                {checker: fieldContains, key: 'title'},
                {checker: datesCheck, key: 'releasedDate'},
                {checker: fieldIsEquals, key: 'bought'},
                {checker: fieldIsEquals, key: 'seen'},
                {checker: numericCheck, key: 'duration'},
                {checker: numericCheck, key: 'price'}
            ];
        };

        return validatorService;
    }
]);

'use strict';

angular.module('movies').factory('StatsMovieService', [
    function() {
        var movieResult = {};

        var statService = {};

        var statistics = {};

        var initStatistics = function () {
            statistics = {
                collections: { field: 'Nombre de collection', value: 0 },
                movies: { field: 'Nombre de Films', value: 0 },
                moviesValue: { field: 'Valeur totale', value: 0 },
                missingValue: { field: 'Valeur non renseignées', value: 0 },
                seen: { field: 'Films terminés', value: 0 },
                notSeen: { field: 'Films non Vu', value: 0 },
                bought: { field: 'Films achetés', value: 0 },
                toBought: { field: 'Films à acheter', value: 0 },
                movieMissing: { field: 'Films manquant', value: 0 },
                totalDuration: { field: 'Durée totale', value: 0 },
                totalSeenDuration: { field: 'Durée totale vu', value: 0},
                toWatchDuration: { field: 'Reste à voir', value: 0 }
            };
        };

        var collectionsRef = [];

        var movieStatistics = function (movie) {
            if (movie.collectionName && !collectionsRef.Contains(movie.collectionName)) {
                collectionsRef.push(movie.collectionName);
            }
            if (movie.title) {
                statistics.movies.value += 1;
            }
            if (movie.bought && movie.title) {
                if (movie.price) {
                    statistics.moviesValue.value += parseFloat(movie.price);
                } else {
                    statistics.missingValue.value += 1;
                }
                if (movie.seen) {
                    statistics.seen.value += 1;
                    statistics.totalSeenDuration.value += movie.duration;
                } else {
                    statistics.notSeen.value += 1;
                    statistics.toWatchDuration.value += movie.duration;
                }
                if (movie.duration) {
                    statistics.totalDuration.value += movie.duration;
                }

                statistics.bought.value += 1;
            } else if (movie.bought === false && movie.title) {
                statistics.toBought.value += 1;
            }

        };

        var collectionsStatistics = function (collection) {
            statistics.movieMissing.value += collection.missing;
            angular.forEach(collection.movies, function (current) {
                movieStatistics(current);
            });
        };

        // Public API

        statService.calculate = function (array) {

            function checkStatsCategoryPercents(firstKey, secondKey, thirdKey) {
                var total = statistics[firstKey].percent + statistics[secondKey].percent + (statistics[thirdKey] && statistics[thirdKey].percent ? statistics[thirdKey].percent : 0);
                if (total < 100) {
                    if (statistics[firstKey].percent > 0 ) {
                        statistics[firstKey].percent += 1;
                    } else if (statistics[secondKey].percent > 0) {
                        statistics[secondKey].percent += 1;
                    } else if (thirdKey && statistics[thirdKey] && statistics[thirdKey].percent && statistics[thirdKey].percent > 0) {
                        statistics[thirdKey].percent += 1;
                    }
                    if (statistics[firstKey].percent + statistics[secondKey].percent + (statistics[thirdKey] && statistics[thirdKey].percent ? statistics[thirdKey].percent : 0) < 100) {
                        checkStatsCategoryPercents(secondKey, thirdKey, firstKey);
                    }
                }
            }
            function checkPercents() {
                checkStatsCategoryPercents('seen', 'notSeen');
                checkStatsCategoryPercents('bought', 'toBought', 'movieMissing');
                checkStatsCategoryPercents('totalSeenDuration', 'toWatchDuration');
            }
            initStatistics();
            collectionsRef = [];

            angular.forEach(array, function (current) {
                if (current.title) {
                    movieStatistics(current);
                } else {
                    collectionsStatistics(current);
                }
            });

            statistics.collections.value = collectionsRef.length;
            statistics.moviesValue.value = statistics.moviesValue.value.toFixed(2);
            statistics.seen.percent = Math.floor(statistics.seen.value * 100 / statistics.bought.value);
            statistics.notSeen.percent = Math.floor(statistics.notSeen.value * 100 / statistics.bought.value);
            statistics.totalSeenDuration.percent = Math.floor(statistics.totalSeenDuration.value * 100 / statistics.totalDuration.value);
            statistics.toWatchDuration.percent = Math.floor(statistics.toWatchDuration.value * 100 / statistics.totalDuration.value);

            if (array && array[0] && array[0].title) {
                statistics.bought.percent = Math.floor(statistics.bought.value * 100 / statistics.movies.value);
                statistics.toBought.percent = Math.floor(statistics.toBought.value * 100 / statistics.movies.value);
            } else {
                statistics.movieMissing.value -= statistics.toBought.value;
                statistics.bought.percent = Math.floor(statistics.bought.value * 100 / (statistics.bought.value + statistics.movieMissing.value + statistics.toBought.value));
                statistics.toBought.percent = Math.floor(statistics.toBought.value * 100 / (statistics.bought.value + statistics.movieMissing.value + statistics.toBought.value));
                statistics.movieMissing.percent = Math.floor(statistics.movieMissing.value * 100 / (statistics.bought.value + statistics.movieMissing.value + statistics.toBought.value));
            }
            checkPercents();

            return statistics;
        };

        return statService;
    }
]);

'use strict';

angular.module('movies').factory('TypesMovieService', [
    function() {
        var typesService = {};

        var typeList = [
            { displayName: 'Action', value: 'action' },
            { displayName: 'Thriller', value: 'thriller' },
            { displayName: 'Aventures', value: 'aventures' },
            { displayName: 'Policier', value: 'policier' },
            { displayName: 'Comédie', value: 'comedie' },
            { displayName: 'Fantastique', value: 'fantastique' },
            { displayName: 'Science Fiction', value: 'sf' }
        ];

        // Public API
        typesService.getTypes = function() {
            return typeList;
        };

        typesService.getType = function(prop) {
            var type = null;
            angular.forEach(typeList, function(current) {
                if (current.value === prop) {
                    type = current;
                }
            });
            return type;
        };

        return typesService;
    }
]);

'use strict';


angular.module('my-api-film').controller('myApiFilmController', ['$scope', '$sce', 'Authentication', 'myApiFilmExposed',
    '$interval', '$timeout',
    function($scope, $sce, Authentication, ApiFilmExposed, $interval, $timeout) {
        // This provides Authentication context.
        $scope.authentication = Authentication;

        $scope.ngClass = 'hidden-op';

        $scope.myInterval = 5000;
        $scope.trailers = [];

        $scope.trailerProp = {
            ngClass: '',
            idx: 0,
            isPaused: false
        };

        function changeFeedCallback(feedProperties, isReversed) {
            feedProperties.ngClass = 'feed-fade-out';
            $timeout(function () {
                if (isReversed){
                    if (feedProperties.idx > 0) {
                        feedProperties.idx -= 1;
                    } else {
                        feedProperties.idx = $scope.trailerNbr;
                    }
                } else {
                    if (feedProperties.idx < $scope.trailerNbr) {
                        feedProperties.idx += 1;
                    } else {
                        feedProperties.idx = 0;
                    }
                }
                feedProperties.ngClass = 'feed-fade-in';
            }, 1000);
        }

        $scope.trailerProp.handler = $interval(function () {
            changeFeedCallback($scope.trailerProp);
        }, 12000);

        function pauseResumeFeed(feedProperties) {
            if (feedProperties.isPaused) {
                feedProperties.handler = $interval(function () {
                    changeFeedCallback(feedProperties);
                }, 12000);
            } else {
                $interval.cancel(feedProperties.handler);
            }
            feedProperties.isPaused = !feedProperties.isPaused;
        }

        $scope.pauseFeed = function () {
            pauseResumeFeed($scope.firstFeed);
        };

        $scope.previousFeed = function () {
            changeFeedCallback($scope.trailerProp, true);
        };

        $scope.nextFeed = function () {
            changeFeedCallback($scope.trailerProp);
        };

        $scope.trustSrc = function(src) {
            return $sce.trustAsResourceUrl(src);
        };

        function lastTrailerCallback(result) {
            $scope.trailers = result.trailer;
            $scope.selected = result.trailer[0];
            $scope.ngClass = 'fade-in';
            $scope.trailerNbr = result.trailer.length - 1;
        }

        ApiFilmExposed.lastTrailer(4).$promise.then(function (result) {
            lastTrailerCallback(result);
        });
    }
]);

'use strict';

angular.module('my-api-film').factory('myApiFilmExposed', ['$resource',
        function($resource) {
            return {
                lastTrailer: function (count) {
                    return $resource('/api/myApiFilm/:apiAction', {}, {
                        getLastTrailer: {
                            method: 'GET',
                            params: {
                                apiAction: 'latestTrailer',
                                count: count
                            }
                        }
                    }).getLastTrailer();
                }
            };
        }
    ]);

'use strict';

// Configuring the Articles module
angular.module('tv-shows').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Séries TV', 'tv-shows', 'dropdown', '/tv-shows(/create)?');
		Menus.addSubMenuItem('topbar', 'tv-shows', 'Liste des Séries Tv', 'tv-shows');
		Menus.addSubMenuItem('topbar', 'tv-shows', 'Liste Collections de Série TV', 'tv-shows/collections');
		Menus.addSubMenuItem('topbar', 'tv-shows', 'Nouvelle Série Tv', 'tv-shows/create');
	}
]);

'use strict';

//Setting up route
angular.module('tv-shows').config(['$stateProvider',
	function($stateProvider) {
		// Tv shows state routing
		$stateProvider.
		state('listTvShowsCollections', {
			url: '/tv-shows/collections',
			templateUrl: 'modules/tv-shows/views/collections-tv-shows.client.view.html'
		}).
		state('listTvShows', {
			url: '/tv-shows',
			templateUrl: 'modules/tv-shows/views/list-tv-shows.client.view.html'
		}).
		state('createTvShow', {
			url: '/tv-shows/create',
			templateUrl: 'modules/tv-shows/views/create-tv-show.client.view.html'
		}).
		state('viewTvShow', {
			url: '/tv-shows/:tvShowId',
			templateUrl: 'modules/tv-shows/views/view-tv-show.client.view.html'
		}).
		state('editTvShow', {
			url: '/tv-shows/:tvShowId/edit',
			templateUrl: 'modules/tv-shows/views/edit-tv-show.client.view.html'
		});
	}
]);

/**
 * Created by Kaze on 08/02/2015.
 */

'use strict';

angular.module('tv-shows').controller('CollectionsTvShowsController', ['$scope', '$location', '$anchorScroll', 'Authentication',
    'TvShowsExposed', 'StatsTvShowsService',
    function ($scope, $location, $anchorScroll, Authentication, TvShowsExposed, StatsService) {
        $scope.authentication = Authentication;
        $scope.oneAtTime = true;

        $scope.goToStats = function() {
            $location.hash('stats');
            $anchorScroll();
        };
        $scope.goTo = function(path) {
            if (path && path !== undefined) {
                $location.path('/tv-shows/' + path);
            }
        };


        TvShowsExposed.getCollections().$promise.then(function(result) {
            $scope.collectionTab = result;
            $scope.stats = StatsService.calculate(result);
            $scope.isLoaded = true;
        });

    }
]);

'use strict';

// Tv shows controller
angular.module('tv-shows').controller('CreateTvShowsController', ['$scope', '$location', '$log', 'Authentication', 'TvShows',
    'TvShowsExposed', 'TvShowsDataService', '$modal','AlloCineAPIExposed',
    function($scope, $location, $log, Authentication, TvShows, TvShowsExposed, TvShowService, $modal, AlloCineExposed) {
        $scope.authentication = Authentication;
        $scope.ratingMax = 10;
        $scope.isDuplicate = false;
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

        $scope.episodeHelper = 'Renseignez le nombre d\'épisode du média entré et non le total de la saison <br> (ex: le DVD/coffret ne contient que 10 des 20 épisodes de la saison, mettez 10)';
        $scope.durationHelper = 'Renseignez la durée moyenne d\'un épisode, et non le total';
        $scope.isLoaded = false;

        $scope.tvShowModel = {
            scenaristsList: [],
            actorsList: [],
            directorsList: [],
            producersList: [],
            seen: 'NOTSEEN',
            bought: true
        };

        $scope.tvShowModel.tvShowRate = 7;

        if ($location.search() && $location.search().param) {
            $scope.mainTitle = 'Dupliquer une série';
            TvShows.get({ tvShowId: $location.search().param }).$promise.then(function (result) {
                $scope.tvShowModel = TvShowService.fillCreateTvShowModel(result);
                $scope.isDuplicate = true;
                $scope.isLoaded = true;
            });
        } else {
            $scope.isLoaded = true;
            $scope.mainTitle = 'Nouvelle série';
        }

        $scope.existingSeries = TvShowsExposed.getCollectionNames();


        $scope.updateField = function(idx, newStr, itemList) {
            $scope.tvShowModel[itemList][idx] = newStr;
        };

        $scope.deleteField = function(index, itemList) {
            $scope.tvShowModel[itemList].splice(index, 1);
        };

        $scope.checkAdd = function(type) {
            return !$scope.tvShowModel[type];
        };

        $scope.addField = function(itemList, item) {
            for (var i = 0; i < $scope.tvShowModel[itemList].length; i++) {
                if ($scope.tvShowModel[itemList][i] === $scope[item]) {
                    $scope.tvShowModel[item] = '';
                    return;
                }
            }

            $scope.tvShowModel[itemList].push($scope.tvShowModel[item]);
            $scope.tvShowModel[item] = '';
        };

        // Create new Tv show
        $scope.create = function() {
            // Create new Tv show object
            var tvShow = TvShowService.createTvShowFromModel($scope.tvShowModel);

            // Redirect after save
            tvShow.$save(function(response) {
                $location.path('tv-shows/' + response._id);

                // Clear form fields
                $scope.name = '';
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.cancelAddDupTvShow = function() {
            var tmpUrl = $location.url().split('=')[1];

            if (tmpUrl) {
                delete $location.$$search.param;
                $location.url('/tv-shows/' + tmpUrl);
            } else {
                $location.url('/tv-shows');
            }
        };

        $scope.searchTVShowsByTitle = function () {
            function searchCallback(result) {
                $scope.tvShowList = result;
                $scope.open();
            }

            AlloCineExposed.search($scope.tvShowModel.searchTvShow, 20, 'tvseries').$promise.then(function(result) {
                searchCallback(result);
            });
        };

        function fillTvShowField(item) {
            $scope.tvShowModel.name = item.title || item.originalTitle;
            $scope.tvShowModel.summary = item.summary;
            $scope.tvShowModel.duration = item.duration;
            $scope.tvShowModel.year = item.releaseDate;
            $scope.tvShowModel.cover = item.coverHref;
            $scope.tvShowModel.actorsList = item.actors ? TvShowService.getLimitedList(item.actors) : undefined;
            $scope.tvShowModel.actor = item.actors ? TvShowService.getListLastOne(item.actors) : undefined;
            $scope.tvShowModel.producersList = item.producers ? TvShowService.getLimitedList(item.producers) : undefined;
            $scope.tvShowModel.producer = item.producers ? TvShowService.getListLastOne(item.producers) : undefined;
            $scope.tvShowModel.creatorsList = item.scenarists ? TvShowService.getLimitedList(item.scenarists) : undefined;
            $scope.tvShowModel.creator = item.scenarists ? TvShowService.getListLastOne(item.scenarists) : undefined;
            $scope.tvShowModel.searchTvShow = '';
        }

        $scope.open = function (size) {

            var modalInstance = $modal.open({
                templateUrl: 'searchTvShowModalContent.html',
                controller: 'searchTvShowModalController',
                size: size,
                resolve: {
                    tvShowList: function () {
                        return $scope.tvShowList;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                fillTvShowField(selectedItem);
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
                $scope.tvShowModel.searchTvShow = '';
            });
        };
    }
]);

'use strict';

// Tv shows controller
angular.module('tv-shows').controller('EditTvShowsController', ['$scope', '$stateParams', '$location', 'Authentication', 'TvShows', 'TvShowsDataService', 'TvShowsExposed',
    function($scope, $stateParams, $location, Authentication, TvShows, TvShowService, TvShowsExposed) {
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

        // Update existing Tv show
        $scope.update = function() {
            var tvShow = TvShowService.createTvShowFromModel($scope.tvShowModel);
            tvShow._id = $scope.tvShowModel._id;
            tvShow.$update(function() {
                $location.path('tv-shows/' + tvShow._id);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find existing Tv show
        $scope.findOne = function() {
            TvShows.get({ tvShowId: $stateParams.tvShowId }).$promise.then(function (result) {
                $scope.tvShowModel = TvShowService.fillCreateTvShowModel(result);
                $scope.isLoaded = true;
                if ($scope.tvShowModel.lastSeen && $scope.tvShowModel.lastSeen >= 0) {
                    $scope.isLastSeen = true;
                }
                if ($scope.tvShowModel.partial && $scope.tvShowModel.partial >= 0) {
                    $scope.isPartial = true;
                }

                $scope.updateField = function(idx, newStr, itemList) {
                    $scope.tvShowModel[itemList][idx] = newStr;
                };

                $scope.deleteField = function(index, itemList) {
                    $scope.tvShowModel[itemList].splice(index, 1);
                };

                $scope.checkAdd = function(type) {
                    return !$scope.tvShowModel[type];
                };

                $scope.addField = function(itemList, item) {
                    for (var i = 0; i < $scope.tvShowModel[itemList].length; i++) {
                        if ($scope.tvShowModel[itemList][i] === $scope[item]) {
                            $scope.tvShowModel[item] = '';
                            return;
                        }
                    }

                    $scope.tvShowModel[itemList].push($scope.tvShowModel[item]);
                    $scope.tvShowModel[item] = '';
                };

            });
            $scope.existingSeries = TvShowsExposed.getCollectionNames();
        };

        $scope.cancelEditTvShow = function () {
            $location.path('/tv-shows/' + $stateParams.tvShowId);
        };
    }
]);

/**
 * Created by Kaze on 12/02/2015.
 */

'use strict';

angular.module('tv-shows').controller('FormTvShowsController', ['$scope', '$stateParams', '$location', '$log', 'Authentication', 'TvShows',
    'TvShowsExposed', 'TvShowsDataService', '$modal','AlloCineAPIExposed',
    function($scope, $stateParams, $location, $log, Authentication, TvShows, TvShowsExposed, TvShowService, $modal, AlloCineExposed) {

        $scope.editInit = function () {
            // Update existing Tv show
            $scope.update = function() {
                var tvShow = TvShowService.createTvShowFromModel($scope.tvShowModel);
                tvShow._id = $scope.tvShowModel._id;
                tvShow.$update(function() {
                    $location.path('tv-shows/' + tvShow._id);
                }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            };

            TvShows.get({ tvShowId: $stateParams.tvShowId }).$promise.then(function (result) {
                $scope.tvShowModel = TvShowService.fillCreateTvShowModel(result);
                $scope.isLoaded = true;
                if ($scope.tvShowModel.lastSeen && $scope.tvShowModel.lastSeen >= 0) {
                    $scope.isLastSeen = true;
                }
            });
        };

        $scope.createInit = function () {
            $scope.isDuplicate = false;
            $scope.tvShowModel = {
                seen: 'NOTSEEN',
                bought: true,
                tvShowRate: 7
            };

            if ($location.search() && $location.search().param) {
                $scope.mainTitle = 'Dupliquer une série';
                TvShows.get({ tvShowId: $location.search().param }).$promise.then(function (result) {
                    $scope.tvShowModel = TvShowService.fillCreateTvShowModel(result);
                    $scope.isDuplicate = true;
                    $scope.isLoaded = true;
                });
            } else {
                $scope.isLoaded = true;
                $scope.mainTitle = 'Nouvelle série';
            }

            // Create new Tv show
            $scope.create = function() {
                // Create new Tv show object
                var tvShow = TvShowService.createTvShowFromModel($scope.tvShowModel);

                // Redirect after save
                tvShow.$save(function(response) {
                    $location.path('tv-shows/' + response._id);

                    // Clear form fields
                    $scope.name = '';
                }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            };
            $scope.searchTVShowsByTitle = function () {
                function searchCallback(result) {
                    $scope.tvShowList = result;
                    $scope.open();
                }

                AlloCineExposed.search($scope.tvShowModel.searchTvShow, 20, 'tvseries').$promise.then(function(result) {
                    searchCallback(result);
                });
            };
            function fillTvShowField(item) {
                $scope.tvShowModel = TvShowService.fillModelFromModal(item);
                $scope.tvShowModel.searchTvShow = '';
            }

            $scope.open = function (size) {

                var modalInstance = $modal.open({
                    templateUrl: 'searchTvShowModalContent.html',
                    controller: 'searchTvShowModalController',
                    size: size,
                    resolve: {
                        tvShowList: function () {
                            return $scope.tvShowList;
                        }
                    }
                });

                modalInstance.result.then(function (selectedItem) {
                    fillTvShowField(selectedItem);
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                    $scope.tvShowModel.searchTvShow = '';
                });
            };
        };

        $scope.authentication = Authentication;
        $scope.ratingMax = 10;
        $scope.isReadonly = false;
        $scope.tvShowModel = {
            scenaristsList: [],
            actorsList: [],
            directorsList: [],
            producersList: []
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

        $scope.episodeHelper = 'Renseignez le nombre d\'épisode du média entré et non le total de la saison <br> (ex: le DVD/coffret ne contient que 10 des 20 épisodes de la saison, mettez 10)';
        $scope.durationHelper = 'Renseignez la durée moyenne d\'un épisode, et non le total';
        $scope.isLoaded = false;

        $scope.existingSeries = TvShowsExposed.getCollectionNames();

        $scope.cancelPage = function () {
            var id = $scope.tvShowModel._id ? '/' + $scope.tvShowModel._id : '';
            $location.path('/tv-shows' + id);
        };

        $scope.updateField = function(idx, newStr, itemList) {
            $scope.tvShowModel[itemList][idx] = newStr;
        };

        $scope.deleteField = function(index, itemList) {
            $scope.tvShowModel[itemList].splice(index, 1);
        };

        $scope.checkAdd = function(type) {
            return !$scope.tvShowModel[type];
        };

        $scope.addField = function(itemList, item) {
            for (var i = 0; i < $scope.tvShowModel[itemList].length; i++) {
                if ($scope.tvShowModel[itemList][i] === $scope[item]) {
                    $scope.tvShowModel[item] = '';
                    return;
                }
            }

            $scope.tvShowModel[itemList].push($scope.tvShowModel[item]);
            $scope.tvShowModel[item] = '';
        };
    }
]);

'use strict';

// List Tv shows controller
angular.module('tv-shows').controller('ListTvShowsController', ['$scope', '$location', '$anchorScroll', 'Authentication', 'TvShows',
    'TvShowsDataService', 'StatsTvShowsService',
    function($scope, $location, $anchorScroll, Authentication, TvShows, TvShowsService, StatsService) {
        $scope.authentication = Authentication;

        $scope.goToStats = function() {
            $location.hash('stats');
            $anchorScroll();
        };

        // Find a list of Tv shows
        $scope.find = function() {
            TvShows.query().$promise.then(function (result) {
                $scope.tvShows = result;
                $scope.isLoaded = true;
                $scope.$watch('filteredTvShows', function () {
                    $scope.stats = StatsService.calculate($scope.filteredTvShows);
                }, true);
            });
        };

        $scope.getDisplayList = function (array) {
            return TvShowsService.getDisplayList(array);
        };
    }
]);

'use strict';

angular.module('tv-shows').controller('searchTvShowModalController', ['$scope', '$modalInstance', 'tvShowList', 'AlloCineAPIExposed',
    function ($scope, $modalInstance, tvShowList, AlloCineExposed) {
        $scope.isCollapsed = true;
        $scope.nothingFound = false;

        if (tvShowList[0].error) {
            $scope.nothingFound = true;
            $scope.stringSearched = tvShowList[0].searchReq;
        } else {
            $scope.tvShowList = tvShowList;
            $scope.selected = {
                tvShow: $scope.tvShowList[0]
            };
        }

        $scope.getTvShowInfo = function (tvShow) {
            $scope.selected.tvShow = tvShow;

            function tvShowInfoCallback(result) {
                $scope.selected.tvShow.producers = result.producers;
                $scope.selected.tvShow.duration = result.duration;
                $scope.selected.tvShow.summary = result.summary.replace(/<[^>]*>/g, '');
                $scope.selected.tvShow.shortSummary = result.shortSummary.replace(/<[^>]*>/g, '');
                $scope.isCollapsed = false;
            }

            AlloCineExposed.getMediaInfo(tvShow.code, 'tvseries').$promise.then(function(result) {
                tvShowInfoCallback(result);
            });
        };

        $scope.ok = function () {
            $modalInstance.close($scope.selected.tvShow);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
]);

'use strict';

// Tv shows controller
angular.module('tv-shows').controller('ViewTvShowsController', ['$scope', '$stateParams', '$location', 'Authentication', 'TvShows', 'TvShowsDataService',
	function($scope, $stateParams, $location, Authentication, TvShows, TvShowsService) {
		$scope.authentication = Authentication;
        $scope.ratingMax = 10;
        $scope.isReadonly = true;
        $scope.showPercent = false;

        $scope.hoveringOver = function() {
            $scope.percent = 100 * ($scope.tvShowModel.tvShowRate / $scope.ratingMax);
            $scope.showPercent = true;
        };

        $scope.ratingStates = [
            {stateOn: 'glyphicon-ok-sign', stateOff: 'glyphicon-ok-circle'},
            {stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty'},
            {stateOn: 'glyphicon-heart', stateOff: 'glyphicon-ban-circle'},
            {stateOn: 'glyphicon-heart'},
            {stateOff: 'glyphicon-off'}
        ];

		//Duplicate existing Tv show
		$scope.duplicateItem = function() {
			$location.path('/tv-shows/create').search({param: $scope.tvShowModel._id});
		};

		// Remove existing Tv show
		$scope.remove = function(tvShow) {
			if ( tvShow ) { 
				tvShow.$remove();

				for (var i in $scope.tvShows) {
					if ($scope.tvShows [i] === tvShow) {
						$scope.tvShows.splice(i, 1);
					}
				}
			} else {
				$scope.tvShow.$remove(function() {
					$location.path('tv-shows');
				});
			}
		};

		// Find existing Tv show
		$scope.findOne = function() {
			TvShows.get({ tvShowId: $stateParams.tvShowId }).$promise.then(function (result) {
				if (result.price === null)
					result.price = undefined;
				$scope.tvShow = result;
				$scope.tvShowModel = TvShowsService.fillViewTvShowModel(result);
				$scope.isLoaded = true;
			});
		};
	}
]);

/**
 * Created by Kaze on 07/02/2015.
 */

'use strict';

angular.module('tv-shows').filter('listShowsFilter', [
    function () {
        return function (ngRepeatItems, searchText) {
            var newList = [];

            function chkSearchTextInList(list) {
                for (var i = 0; i < list.length; i++) {
                    if (list[i] && angular.lowercase(list[i]).indexOf(angular.lowercase(searchText)) >= 0) {
                        return true;
                    }
                }
                return false;
            }

            function checkInfosItem(item) {
                return item && angular.lowercase(item).indexOf(angular.lowercase(searchText)) >= 0;
            }

            angular.forEach(ngRepeatItems, function(item) {
                if (checkInfosItem(item.tvShowName) || chkSearchTextInList(item.producers) || chkSearchTextInList(item.actors)) {
                    newList.push(item);
                }
            });

            if (!searchText && newList.length <= 0)
                newList = ngRepeatItems;
            return newList;
        };
    }
]);

/**
 * Created by Kaze on 07/02/2015.
 */

'use strict';

angular.module('tv-shows').filter('MultiSearchTvShowFilter', ['MultiSearchTvShowValidatorService',
    function (ValidatorService) {
        return function (ngRepeatArray, data) {
            var newList = [];

            var filters = ValidatorService.getFields(data);

            var validators = ValidatorService.getValidators();
            angular.forEach(ngRepeatArray, function (current) {
                var isChecked = true;
                angular.forEach(validators, function (item, idx) {
                    if (!item.checker(filters[idx], current[item.key])) {
                        isChecked = false;
                    }
                });
                if (isChecked) {
                    newList.PushUnique(current);
                }
            });
            if (filters.IsEmptyOrUndefined() && newList.length <= 0) {
                newList = ngRepeatArray;
            }

            return newList;
        };
    }
]);

/**
 * Created by Kaze on 07/02/2015.
 */

'use strict';

angular.module('movies').factory('MultiSearchTvShowValidatorService', [
    function() {
        var validatorService = {};

        // Public API
        validatorService.getFields = function (multiSearch) {
            return [
                multiSearch.nameSearch,
                multiSearch.actorSearch ? multiSearch.actorSearch.split(' ') : multiSearch.actorSearch,
                multiSearch.producerSearch ? multiSearch.producerSearch.split(' ') : multiSearch.producerSearch,
                multiSearch.scenaristSearch ? multiSearch.scenaristSearch.split(' ') : multiSearch.scenaristSearch,
                multiSearch.seasonSearch,
                multiSearch.channelSearch,
                multiSearch.yearSearch,
                multiSearch.boughtSearch,
                multiSearch.seenSearch,
                multiSearch.durationSearch,
                multiSearch.prices
            ];
        };

        validatorService.getValidators = function () {
            var fieldContains = function (search, key) {
                if (!search) {
                    return !search;
                }
                return key.ContainsLower(search);
            };

            var arrayContains = function (search, key) {
                if (!search) {
                    return !search;
                }
                var found = true;
                angular.forEach(search, function (current) {
                    if (!key.ContainsLower(current)) {
                        found = false;
                    }
                });
                return found;
            };

            var fieldIsEquals = function (search, key) {
                if (search === undefined || search === '' || search === null) {
                    return true;
                }
                return key === search;
            };

            var numericIsEquals = function (search, key) {
                if (search === undefined || search === '' || search === null) {
                    return true;
                }
                return parseInt(key) === parseInt(search);
            };

            var numericCheck = function (search, key) {
                if ((!search || !search.start) || (search.type === 'between' && ((!search.start || !search.end) || (search.start > search.end)))) {
                    return true;
                }
                if (search.type === 'exact') {
                    return search.start === parseInt(key);
                } else if (search.type === 'more') {
                    return search.start <= parseInt(key);
                } else if (search.type === 'less') {
                    return search.start >= parseInt(key);
                } else {
                    return search.start <= parseInt(key) && search.end >= parseInt(key);
                }
            };

            var datesCheck = function (search, key) {
                if ((!search || !search.start) || (search.type === 'between' && ((!search.start || !search.end)))) {
                    return true;
                }
                if (search.type === 'exact') {
                    return new Date(search.start).getTime() === new Date(key).getTime();
                } else if (search.type === 'since') {
                    return new Date(search.start).getTime() <= new Date(key).getTime();
                } else if (search.type === 'before') {
                    return new Date(search.start).getTime() >= new Date(key).getTime();
                } else {
                    return new Date(search.start).getTime() <= new Date(key).getTime() && new Date(search.end).getTime() >= new Date(key).getTime();
                }
            };

            return [
                {checker: fieldContains, key: 'tvShowName'},
                {checker: arrayContains, key: 'actors'},
                {checker: arrayContains, key: 'producers'},
                {checker: arrayContains, key: 'creators'},
                {checker: numericIsEquals, key: 'season'},
                {checker: fieldContains, key: 'channel'},
                {checker: numericIsEquals, key: 'year'},
                {checker: fieldIsEquals, key: 'bought'},
                {checker: fieldIsEquals, key: 'seen'},
                {checker: numericCheck, key: 'duration'},
                {checker: numericCheck, key: 'price'}
            ];
        };

        return validatorService;
    }
]);

/**
 * Created by Kaze on 03/02/2015.
 */

'use strict';

angular.module('tv-shows').factory('StatsTvShowsService', [
    function() {
        var statService = {};

        var statistics = {};

        var initStatistics = function () {
            statistics = {
                series: { field: 'Nombre de série', value: 0 },
                media: { field: 'Nombre de média', value: 0 },
                tvShowsValue: { field: 'Valeur totale', value: 0 },
                missingValue: { field: 'Valeur non renseignées', value: 0 },
                seen: { field: 'Séries terminés', value: 0 },
                onGoing: { field: 'Séries en cours', value:0 },
                notSeen: { field: 'Séries non vu', value: 0 },
                bought: { field: 'Séries achetés', value: 0 },
                toBought: { field: 'Séries à acheter', value: 0 },
                mediaMissing: { field: 'Séries manquantes', value: 0},
                totalDuration: { field: 'Durée totale', value: 0 },
                totalSeenDuration: { field: 'Durée totale vu', value: 0},
                toWatchDuration: { field: 'Reste à voir', value: 0 }
            };
        };

        var collectionsRef = [];

        var tvShowStatistics = function (tvShow) {
            if (tvShow.tvShowName && !collectionsRef.Contains(tvShow.tvShowName)) {
                collectionsRef.push(tvShow.tvShowName);
            }
            if (tvShow.tvShowName) {
                statistics.media.value += 1;
            }
            if (tvShow.bought && tvShow.tvShowName) {
                if (tvShow.price) {
                    statistics.tvShowsValue.value += parseFloat(tvShow.price);
                } else {
                    statistics.missingValue.value += 1;
                }
                if (tvShow.seen === 'SEEN') {
                    statistics.seen.value += 1;
                    statistics.totalSeenDuration.value += (tvShow.duration * tvShow.episodes);
                } else if (tvShow.seen === 'NOTSEEN') {
                    statistics.notSeen.value += 1;
                    statistics.toWatchDuration.value += (tvShow.duration * tvShow.episodes);
                } else {
                    statistics.onGoing.value += 1;
                    statistics.totalSeenDuration.value += (tvShow.duration * tvShow.lastSeen);
                    statistics.toWatchDuration.value += (tvShow.duration * (tvShow.episodes - tvShow.lastSeen));
                }
                if (tvShow.duration && tvShow.episodes) {
                    statistics.totalDuration.value += (tvShow.duration * tvShow.episodes);
                }
                statistics.bought.value += 1;
            } else if (tvShow.bought === false && tvShow.created) {
                statistics.toBought.value += 1;
            }

        };

        var collectionsStatistics = function (collection) {
            statistics.mediaMissing.value += collection.missing;
            angular.forEach(collection.tvShows, function (current) {
                tvShowStatistics(current);
            });
        };

        // Public API

        statService.calculate = function (array) {

            function checkStatsCategoryPercents(firstKey, secondKey, thirdKey) {
                var total = statistics[firstKey].percent + statistics[secondKey].percent + (statistics[thirdKey] && statistics[thirdKey].percent ? statistics[thirdKey].percent : 0);
                if (total < 100) {
                    if (statistics[firstKey].percent > 0 ) {
                        statistics[firstKey].percent += 1;
                    } else if (statistics[secondKey].percent > 0) {
                        statistics[secondKey].percent += 1;
                    } else if (thirdKey && statistics[thirdKey] && statistics[thirdKey].percent && statistics[thirdKey].percent > 0) {
                        statistics[thirdKey].percent += 1;
                    }
                    if (statistics[firstKey].percent + statistics[secondKey].percent + (statistics[thirdKey] && statistics[thirdKey].percent ? statistics[thirdKey].percent : 0) < 100) {
                        checkStatsCategoryPercents(secondKey, thirdKey, firstKey);
                    }
                }
            }
            function checkPercents() {
                checkStatsCategoryPercents('seen', 'onGoing', 'notSeen');
                checkStatsCategoryPercents('bought', 'toBought', 'mediaMissing');
                checkStatsCategoryPercents('totalSeenDuration', 'toWatchDuration');
            }
            initStatistics();
            collectionsRef = [];

            angular.forEach(array, function (current) {
                if (current.tvShowName) {
                    tvShowStatistics(current);
                } else {
                    collectionsStatistics(current);
                }
            });

            statistics.series.value = collectionsRef.length;
            statistics.tvShowsValue.value = statistics.tvShowsValue.value.toFixed(2);
            statistics.seen.percent = Math.floor(statistics.seen.value * 100 / statistics.bought.value);
            statistics.onGoing.percent = Math.floor(statistics.onGoing.value * 100 / statistics.bought.value);
            statistics.notSeen.percent = Math.floor(statistics.notSeen.value * 100 / statistics.bought.value);
            statistics.totalSeenDuration.percent = Math.floor(statistics.totalSeenDuration.value * 100 / statistics.totalDuration.value);
            statistics.toWatchDuration.percent = Math.floor(statistics.toWatchDuration.value * 100 / statistics.totalDuration.value);

            if (array && array[0] && (array[0].title || array[0].tvShowName)) {
                statistics.bought.percent = Math.floor(statistics.bought.value * 100 / statistics.media.value);
                statistics.toBought.percent = Math.floor(statistics.toBought.value * 100 / statistics.media.value);
            } else {
                statistics.mediaMissing.value -= statistics.toBought.value;
                statistics.bought.percent = Math.floor(statistics.bought.value * 100 / (statistics.bought.value + statistics.mediaMissing.value + statistics.toBought.value));
                statistics.toBought.percent = Math.floor(statistics.toBought.value * 100 / (statistics.bought.value + statistics.mediaMissing.value + statistics.toBought.value));
                statistics.mediaMissing.percent = Math.floor(statistics.mediaMissing.value * 100 / (statistics.bought.value + statistics.mediaMissing.value + statistics.toBought.value));
            }
            checkPercents();

            return statistics;
        };

        return statService;
    }
]);

/**
 * Created by matthias.brunet on 02/02/2015.
 */

'use strict';

angular.module('tv-shows').factory('TvShowsDataService', ['TvShows',
    function (TvShows) {
        var dataService = {};

        dataService.getLimitedList = function (array) {
            var limitedList = [];
            angular.forEach(array, function(current, idx) {
                if (idx < array.length - 1) {
                    limitedList.push(current.trim());
                }
            });
            return limitedList;
        };

        dataService.getListLastOne = function (array) {
            if (array.length > 0) {
                return array[array.length - 1].trim();
            }
            return '';
        };

        dataService.getDisplayList = function (array) {
            if (!array || array.length === 0) {
                return '';
            }
            var displayList = '';

            angular.forEach(array, function (item) {
                if (displayList !== '' && item)
                    displayList += ', ';
                displayList += item;
            });

            return displayList;

        };

        function fillBaseTvShowModel(tvShow) {
            return {
                _id: tvShow._id,
                name: tvShow.tvShowName,
                season: tvShow.season,
                episodes: tvShow.episodes,
                partial: tvShow.partial,
                lastSeen: tvShow.lastSeen,
                seen: tvShow.seen,
                bought: tvShow.bought,
                price: parseFloat(tvShow.price),
                cover: tvShow.cover,
                channel: tvShow.channel,
                duration: tvShow.duration,
                year: tvShow.year,
                tvShowRate: tvShow.tvShowRate,
                summary: tvShow.summary
            };
        }

        dataService.fillModelFromModal = function (item) {
            return {
                name: item.title || item.originalTitle,
                summary: item.summary,
                duration: item.duration,
                year: item.releaseDate,
                cover: item.coverHref,
                actorsList: item.actors ? dataService.getLimitedList(item.actors) : [],
                actor: item.actors ? dataService.getListLastOne(item.actors) : undefined,
                producersList: item.producers ? dataService.getLimitedList(item.producers) : [],
                producer: item.producers ? dataService.getListLastOne(item.producers) : undefined,
                creatorsList: item.scenarists ? dataService.getLimitedList(item.scenarists) : [],
                creator: item.scenarists ? dataService.getListLastOne(item.scenarists) : undefined,
                seen: 'SEEN',
                bought: true
            };
        };

        dataService.fillLightTvSHowModel = function (tvShow) {
            var model = fillBaseTvShowModel(tvShow);
            model.producers = dataService.getDisplayList(tvShow.producers);
            model.actors = dataService.getDisplayList(tvShow.actors);
            return model;
        };

        dataService.fillCreateTvShowModel = function (tvShow) {
            var model = fillBaseTvShowModel(tvShow);

            model.producersList = dataService.getLimitedList(tvShow.producers);
            model.producer = dataService.getListLastOne(tvShow.producers);
            model.creatorsList = dataService.getLimitedList(tvShow.creators);
            model.creator = dataService.getListLastOne(tvShow.creators);
            model.actorsList = dataService.getLimitedList(tvShow.actors);
            model.actor = dataService.getListLastOne(tvShow.actors);

            return model;
        };

        dataService.fillViewTvShowModel = function (tvShow) {
            var model = fillBaseTvShowModel(tvShow);

            model.producers = dataService.getDisplayList(tvShow.producers);
            model.creators = dataService.getDisplayList(tvShow.creators);
            model.actors = dataService.getDisplayList(tvShow.actors);
            model.price = tvShow.price ? model.price.toFixed(2) : null;

            return model;
        };

        dataService.createTvShowFromModel = function (model) {

            function fillTabs(modelTab, modelField) {
                var tab = [];
                angular.forEach(modelTab, function (current) {
                    tab.push(current);
                });
                if (modelField) {
                    tab.push(modelField);
                }
                return tab;
            }

            return new TvShows ({
                tvShowName: model.name,
                season: model.season,
                episodes: model.episodes,
                partial: model.partial,
                lastSeen: model.lastSeen,
                seen: model.seen,
                bought: model.bought,
                price: model.price,
                producers: fillTabs(model.producersList, model.producer),
                creators: fillTabs(model.creatorsList, model.creator),
                actors: fillTabs(model.actorsList, model.actor),
                cover: model.cover,
                channel: model.channel,
                duration: model.duration,
                year: model.year,
                tvShowRate: model.tvShowRate,
                summary: model.summary
            });
        };

        return dataService;
}]);

/**
 * Created by matthias.brunet on 02/02/2015.
 */

'use strict';

angular.module('tv-shows').factory('TvShowsExposed', ['$resource',
        function ($resource) {
            var exposedApi = {};

            exposedApi.getLatest = {
                method: 'GET',
                isArray: false,
                params: {
                    apiAction: 'latest'
                }
            };

            exposedApi.getCollectionNames = {
                method: 'GET',
                isArray: true,
                params: {
                    apiAction: 'names'
                }
            };

            exposedApi.getCollections = {
                method: 'GET',
                isArray: true,
                params: {
                    apiAction: 'collections'
                }
            };

            return $resource('/api/tvshows/:apiAction', {}, exposedApi);
        }
    ]);

'use strict';

//Tv shows service used to communicate Tv shows REST endpoints
angular.module('tv-shows').factory('TvShows', ['$resource',
	function($resource) {
		return $resource('tv-shows/:tvShowId', { tvShowId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invalid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		});
	}
]);
'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [
	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);