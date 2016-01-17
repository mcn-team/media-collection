'use strict';

// Configuring the Articles module
angular.module('books').run(['Menus',
    function(Menus) {
        // Set top bar menu items
        Menus.addMenuItem('topbar', 'Livres', 'books', 'dropdown', '/books(/create)?');
        Menus.addSubMenuItem('topbar', 'books', 'Liste des Livres', 'books');
        Menus.addSubMenuItem('topbar', 'books', 'List Collections de Livre', 'books/collections');
        Menus.addSubMenuItem('topbar', 'books', 'Nouveau Livre', 'books/create');
    }
]);
