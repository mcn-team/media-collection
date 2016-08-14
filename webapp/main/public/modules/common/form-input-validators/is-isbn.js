'use strict';

angular.module('mediacollection').directive('isIsbn', [
    'IsbnConverter',
    function (IsbnConverter) {
        return {
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {
                ctrl.$validators.isIsbn = function (modelValue, viewValue) {
                    if (ctrl.$isEmpty(modelValue) || (viewValue.length !== 10 && viewValue.length !== 13)) {
                        return true;
                    }

                    if (viewValue.length === 10 && IsbnConverter.validISBN10(viewValue)) {
                        return true;
                    }

                    if (viewValue.length === 13 && IsbnConverter.validISBN13(viewValue)) {
                        return true;
                    }

                    return false;
                };
            }
        };
    }
]);
