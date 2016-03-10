'use strict';

// Configuring the Articles module
angular.module('movies').run([
    'Menus', 'LanguageServices',
    function(Menus, LanguageServices) {
        LanguageServices.fetchLanguages(function (err) {
            if (!err) {
                var fields = LanguageServices.lang['en'].home;
                // Set top bar menu items
                Menus.addMenuItem('topbar', fields.MOVIE_HEADER, 'movies', 'dropdown', '/movies(/create)?');
                Menus.addSubMenuItem('topbar', 'movies', fields.MOVIE_LIST, 'movies');
                Menus.addSubMenuItem('topbar', 'movies', fields.MOVIE_COLLECTION, 'movies/collections');
                Menus.addSubMenuItem('topbar', 'movies', fields.ADD_MOVIE, 'movies/create');
            }
        });
    }
]);
