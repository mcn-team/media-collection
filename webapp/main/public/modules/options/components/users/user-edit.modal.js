'use strict';

angular.module('options').controller('UserModalCtrl', [
    '$scope', '$uibModalInstance', 'lodash', 'user',
    function ($scope, $uibModalInstance, _, user) {
        var originalUser = _.assign({}, user);
        $scope.user = user;

        $scope.validate = function () {
            var edited = {};

            _.forEach($scope.user, function (value, key) {
                if (value !== originalUser[key]) {
                    edited[key] = value;
                }
            });

            $uibModalInstance.close(edited);
        };

        $scope.dismissModal = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);
