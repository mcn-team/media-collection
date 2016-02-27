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
