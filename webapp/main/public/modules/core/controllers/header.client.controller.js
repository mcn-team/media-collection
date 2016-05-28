'use strict';

angular.module('core').controller('HeaderController', [
    '$scope', '$state', 'Authentication', 'Menus', 'UserServices',
    function($scope, $state, Authentication, Menus, UserServices) {
        $scope.authentication = Authentication;
        $scope.isCollapsed = false;

        function successCallback(response) {
            $scope.isSigned = !response.data.exists;
            console.log(self.isSigned);
        }

        UserServices.isUser().then(successCallback);

        $scope.menu = Menus.getMenu('topbar');

        $scope.toggleCollapsibleMenu = function() {
            $scope.isCollapsed = !$scope.isCollapsed;
        };

        $scope.signOut = function () {
            Authentication.dropCredentials();
            $state.go('home', {}, { reload: true });
        };

        // Collapsing the menu after navigation
        $scope.$on('$stateChangeSuccess', function() {
            $scope.isCollapsed = false;
        });
    }
]);
