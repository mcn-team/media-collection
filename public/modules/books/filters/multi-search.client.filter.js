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
