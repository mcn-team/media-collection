'use strict';

angular.module('movies').factory('TypesMovieService', [
    function() {
        var typesService = {};

        var typeList = [
            { displayName: 'Action', value: 'action' },
            { displayName: 'Thriller', value: 'thriller' },
            { displayName: 'Aventures', value: 'aventures' },
            { displayName: 'Policier', value: 'policier' },
            { displayName: 'Comédie', value: 'comedie' },
            { displayName: 'Fantastique', value: 'fantastique' },
            { displayName: 'Science Fiction', value: 'sf' }
        ];

        // Public API
        typesService.getTypes = function() {
            return typeList;
        };

        typesService.getType = function(prop) {
            var type = null;
            angular.forEach(typeList, function(current) {
                if (current.value === prop) {
                    type = current;
                }
            });
            return type;
        };

        return typesService;
    }
]);
