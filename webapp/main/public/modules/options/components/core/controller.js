'use strict';

angular.module('options').controller('OptionsController', [
    '$scope', '$window',
    'Authentication',
    function ($scope, $window, Authentication) {
        var self = this;
        self.authentication = Authentication.checkAuth();
        if (!self.authentication.user.admin) {
            $window.history.back();
        }

        self.pageTitle = 'Options';
    }
]);
