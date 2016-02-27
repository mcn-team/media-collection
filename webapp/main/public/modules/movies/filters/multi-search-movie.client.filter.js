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
