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
