'use strict';

angular.module('upload').factory('UploadServices', [
    '$http', 'Config', 'Authentication',
    function ($http, Config, Authentication) {
        var uploadServices = [];
        var httpConfig = null;
        var buildEndpoint = function (path) {
            var creds = Authentication.credentials ? Authentication.credentials.token : null;
            httpConfig = {
                headers: {
                    'auth-web-token': creds,
                    'Content-Type': undefined
                }
            };
            return Config.apiRoute + path;
        };

        uploadServices.uploadCover = function (payload) {
            return $http.post(buildEndpoint('/upload/covers'), payload, httpConfig);
        };

        return uploadServices;
    }
]);
