'use strict';

angular.module('core').controller('HeaderController', [
    '$rootScope', '$scope', '$state', 'Authentication', 'Menus', 'UserServices',
    function($rootScope, $scope, $state, Authentication, Menus, UserServices) {
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
        
        $rootScope.$on('isSigned:changed', function () {
            $scope.isSigned = UserServices.getIsSigned();
        });
    }
]);
