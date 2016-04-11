'use strict';

// Configuring the Articles module
angular.module('books').run([
    'Menus',
    function(Menus) {
        Menus.addMenuItem('topbar', 'BOOK_HEADER', 'books', 'dropdown', '/books(/create)?');
        Menus.addSubMenuItem('topbar', 'books', 'BOOK_LIST', 'books');
        Menus.addSubMenuItem('topbar', 'books', 'BOOK_COLLECTION', 'books/collections');
        Menus.addSubMenuItem('topbar', 'books', 'ADD_BOOK', 'books/create');
    }
]);
