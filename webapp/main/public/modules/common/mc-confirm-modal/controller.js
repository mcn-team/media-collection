'use strict';

angular.module('mediacollection').controller('ConfirmCtrl', [
    '$scope', '$uibModalInstance',
    'Title', 'Message',
    function ($scope, $uibModalInstance, Title, Message) {
        $scope.title = Title;
        $scope.message = Message;

        $scope.validate = function () {
            $uibModalInstance.close();
        };

        $scope.dismissModal = function () {
            $uibModalInstance.dismiss();
        }
    }
]);
