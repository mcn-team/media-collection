'use strict';

module.exports = function(app) {
    var users = require('../../app/controllers/users.server.controller');
    var tvShows = require('../../app/controllers/tv-shows.server.controller');

    // Tv shows Routes
    app.route('/tv-shows')
        .get(users.requiresLogin, tvShows.list)
        .post(users.requiresLogin, tvShows.create);

    app.route('/tv-shows/:tvShowId')
        .get(users.requiresLogin, tvShows.read)
        .put(users.requiresLogin, tvShows.update)
        .delete(users.requiresLogin, tvShows.delete);

    // TV Shows API Routes

    app.route('/api/tvshows/names')
        .get(users.requiresLogin, tvShows.getCollectionNames);

    app.route('/api/tvshows/collections')
        .get(users.requiresLogin, tvShows.getCollections);

    app.route('/api/tvshows/latest')
        .get(users.requiresLogin, tvShows.getLatest);

    // Finish by binding the Tv show middleware
    app.param('tvShowId', tvShows.tvShowByID);
};
