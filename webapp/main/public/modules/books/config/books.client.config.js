'use strict';

// Configuring the Articles module
angular.module('books').run([
    'Menus', 'LanguageServices',
    function(Menus, LanguageServices) {
        LanguageServices.fetchLanguages(function (err) {
            if (!err) {
                var fields = LanguageServices.lang['en'].home;
                // Set top bar menu items
                Menus.addMenuItem('topbar', fields.BOOK_HEADER, 'books', 'dropdown', '/books(/create)?');
                Menus.addSubMenuItem('topbar', 'books', fields.BOOK_LIST, 'books');
                Menus.addSubMenuItem('topbar', 'books', fields.BOOK_COLLECTION, 'books/collections');
                Menus.addSubMenuItem('topbar', 'books', fields.ADD_BOOK, 'books/create');
            }
        });
    }
]);
