'use strict';

angular.module('options').directive('mcUsers', [
    '$uibModal', 'UserServices',
    function ($uibModal, UserServices) {
        return {
            restrict: 'E',
            templateUrl: 'modules/options/components/users/view.html',
            link: function (scope) {
                var successCallback = function (response) {
                    scope.usersList = response.data;
                };

                var failureCallback = function (errorResponse) {
                    console.error(errorResponse);
                };

                UserServices.getUsers().then(successCallback, failureCallback);

                scope.editUser = function(user) {
                    var modalInstance = $uibModal.open({
                        templateUrl: 'userEditModal.html',
                        controller: 'UserModalCtrl',
                        size: 'lg',
                        resolve: {
                            user: function () {
                                return user;
                            }
                        }
                    });

                    modalInstance.result.then(function () {}, function (cancelResponse) {
                        console.error(cancelResponse);
                    });
                };

                scope.deleteUser = function (user) {
                    var modalInstance = $uibModal.open({
                        templateUrl: 'confirmModal.html',
                        controller: 'ConfirmCtrl',
                        size: 'lg',
                        resolve: {
                            Title: function () {
                                return user.displayName;
                            },
                            Message: function () {
                                return 'DELETE_MESSAGE';
                            }
                        }
                    });

                    modalInstance.result.then(function (response) {
                        console.log(response);
                    }, function (cancelResponse) {
                        console.error(cancelResponse);
                    });
                };
            }
        };
    }
]);
