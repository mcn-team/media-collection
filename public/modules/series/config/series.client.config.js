'use strict';

// Configuring the Articles module
angular.module('series').run(['Menus',
    function(Menus) {
        // Set top bar menu items
        Menus.addMenuItem('topbar', 'Series', 'series', 'dropdown', '/series(/create)?');
        Menus.addSubMenuItem('topbar', 'series', 'List Series', 'series');
        Menus.addSubMenuItem('topbar', 'series', 'New Series', 'series/create');
    }
]);