'use strict';

angular.module('options').controller('OptionsController', [
    '$scope',
    'Authentication',
    function ($scope, Authentication) {
        var self = this;
        self.authentication = Authentication.checkAuth();

        self.pageTitle = 'Options';
    }
]);
