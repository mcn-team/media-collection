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
                if (!key) {
                    return false;
                }
                if (!search) {
                    return !search;
                }
                return key.ContainsLower(search);
            };

            var arrayContains = function (search, key) {
                if (!key) {
                    return false;
                }
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
                if (!key) {
                    return false;
                }
                if (search === undefined || search === '' || search === null) {
                    return true;
                }
                return parseInt(key) === parseInt(search);
            };

            var numericCheck = function (search, key) {
                if (!key) {
                    return search == key;
                }
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
                if (!key) {
                    return false;
                }
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
