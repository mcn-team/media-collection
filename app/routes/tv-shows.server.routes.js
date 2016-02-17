'use strict';

module.exports = function(app) {
    var users = require('../../app/controllers/users.server.controller');
    var tvShows = require('../../app/controllers/tv-shows.server.controller');

    // Tv shows Routes
    app.route('/tv-shows')
        .get(tvShows.list)
        .post(tvShows.create);

    app.route('/tv-shows/:tvShowId')
        .get(tvShows.read)
        .put(tvShows.update)
        .delete(tvShows.delete);

    // TV Shows API Routes

    app.route('/api/tvshows/names')
        .get(tvShows.getCollectionNames);

    app.route('/api/tvshows/collections')
        .get(tvShows.getCollections);

    app.route('/api/tvshows/latest')
        .get(tvShows.getLatest);

    // Finish by binding the Tv show middleware
    app.param('tvShowId', tvShows.tvShowByID);
};
