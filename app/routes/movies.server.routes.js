'use strict';

module.exports = function(app) {
    var users = require('../../app/controllers/users.server.controller');
    var movies = require('../../app/controllers/movies.server.controller');

    // Movies Routes
    app.route('/movies')
        .get(movies.list)
        .post(movies.create);

    app.route('/movies/:movieId')
        .get(movies.read)
        .put(movies.update)
        .delete(movies.delete);

    // Books api Routea
    app.route('/api/movies/latest')
        .get(movies.getLatestMovie);

    app.route('/api/movies/collections')
        .get(movies.getCollectionsList);

    app.route('/api/movies/names')
        .get(movies.getCollectionNames);

    // Finish by binding the Movie middleware
    app.param('movieId', movies.movieByID);
};
