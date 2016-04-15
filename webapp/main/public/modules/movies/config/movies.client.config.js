'use strict';

// Configuring the Articles module
angular.module('movies').run([
    'Menus',
    function(Menus) {
        Menus.addMenuItem('topbar', 'MOVIE_HEADER', 'movies', 'dropdown', '/movies(/create)?');
        Menus.addSubMenuItem('topbar', 'movies', 'MOVIE_LIST', 'movies');
        Menus.addSubMenuItem('topbar', 'movies', 'MOVIE_COLLECTION', 'movies/collections');
        Menus.addSubMenuItem('topbar', 'movies', 'ADD_MOVIE', 'movies/create');
    }
]);
