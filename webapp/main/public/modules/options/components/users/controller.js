'use strict';

angular.module('options').directive('mcUsers', [
    '$uibModal', 'UserServices', 'lodash', 'Authentication',
    function ($uibModal, UserServices, _, Authentication) {
        return {
            restrict: 'E',
            templateUrl: 'modules/options/components/users/view.html',
            link: function (scope) {
                var getUsers = function () {
                    var successCallback = function (response) {
                        scope.usersList = response.data;
                    };

                    var failureCallback = function (errorResponse) {
                        console.error(errorResponse);
                    };

                    UserServices.getUsers().then(successCallback, failureCallback);
                };

                getUsers();

                scope.newUser = {};

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

                    modalInstance.result.then(function () {
                        var successCallback = function (response) {
                            scope.usersList = _.filter(scope.usersList, function (elem) {
                                return elem._id !== response.data._id;
                            });
                        };

                        var failureCallback = function (errorResponse) {
                            console.error(errorResponse);
                        };

                        UserServices.deleteUser(user._id).then(successCallback, failureCallback);
                    }, function (cancelResponse) {
                        console.error(cancelResponse);
                    });
                };

                scope.addUser = function () {
                    var successCallback = function () {
                        scope.newUser = {};
                        getUsers();
                    };

                    var failureCallback = function (errorResponse) {
                        console.error(errorResponse);
                    };

                    var credentials = Authentication.encryptCredentials(scope.newUser);

                    UserServices.signup(credentials, true).then(successCallback, failureCallback);
                }
            }
        };
    }
]);
