'use strict';

angular.module('options').controller('UserModalCtrl', [
    '$scope', '$uibModalInstance', 'lodash', 'UserServices', 'user',
    function ($scope, $uibModalInstance, _, UserServices, user) {
        var originalUser = _.assign({}, user);
        $scope.user = user;

        $scope.validate = function () {
            var edited = {};

            _.forEach($scope.user, function (value, key) {
                if (value !== originalUser[key]) {
                    edited[key] = value;
                }
            });

            var successCallback = function () {
                $uibModalInstance.close();
            };

            var failureCallback = function (errorResponse) {
                console.error(errorResponse);
            };

            UserServices.updateUser($scope.user._id, edited).then(successCallback, failureCallback);
        };

        $scope.dismissModal = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);
