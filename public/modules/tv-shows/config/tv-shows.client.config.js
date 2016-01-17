'use strict';

// Configuring the Articles module
angular.module('tv-shows').run(['Menus',
    function(Menus) {
        // Set top bar menu items
        Menus.addMenuItem('topbar', 'Séries TV', 'tv-shows', 'dropdown', '/tv-shows(/create)?');
        Menus.addSubMenuItem('topbar', 'tv-shows', 'Liste des Séries Tv', 'tv-shows');
        Menus.addSubMenuItem('topbar', 'tv-shows', 'Liste Collections de Série TV', 'tv-shows/collections');
        Menus.addSubMenuItem('topbar', 'tv-shows', 'Nouvelle Série Tv', 'tv-shows/create');
    }
]);
