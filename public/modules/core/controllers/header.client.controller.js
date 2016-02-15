'use strict';

angular.module('core').controller('HeaderController', [
    '$scope', '$state', 'Authentication', 'Menus',
    function($scope, $state, Authentication, Menus) {
        $scope.authentication = Authentication;
        $scope.isCollapsed = false;
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
