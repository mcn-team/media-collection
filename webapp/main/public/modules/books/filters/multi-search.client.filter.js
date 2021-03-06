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
                    if (filters[idx] === undefined) {
                        return;
                    }
                    if (!item.checker(filters[idx], current[item.key], item.sub)) {
                        isChecked = false;
                    }
                });
                if (isChecked) {
                    newBookList.PushUnique(current);
                }
            });
            if (filters.IsEmptyOrUndefined()) {
                newBookList = ngRepeatArray;
            }

            return newBookList;
        };
    }
]);
