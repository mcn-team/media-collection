'use strict';

// Configuring the Articles module
angular.module('movies').run(['Menus',
    function(Menus) {
        // Set top bar menu items
        Menus.addMenuItem('topbar', 'Films', 'movies', 'dropdown', '/movies(/create)?');
        Menus.addSubMenuItem('topbar', 'movies', 'Liste des Films', 'movies');
        Menus.addSubMenuItem('topbar', 'movies', 'Liste Collections de Film', 'movies/collections');
        Menus.addSubMenuItem('topbar', 'movies', 'Nouveau Film', 'movies/create');
    }
]);
