'use strict';

angular.module('options').controller('UserModalCtrl', [
    '$scope', '$uibModalInstance', 'user',
    function ($scope, $uibModalInstance, user) {
        $scope.user = user;

        $scope.validate = function () {
            $uibModalInstance.close('ok');
        };

        $scope.dismissModal = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);
