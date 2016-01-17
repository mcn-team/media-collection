'use strict';

module.exports = function(app) {
    var users = require('../../app/controllers/users.server.controller');
    var movies = require('../../app/controllers/movies.server.controller');

    // Movies Routes
    app.route('/movies')
        .get(users.requiresLogin, movies.list)
        .post(users.requiresLogin, movies.create);

    app.route('/movies/:movieId')
        .get(users.requiresLogin, movies.read)
        .put(users.requiresLogin, movies.hasAuthorization, movies.update)
        .delete(users.requiresLogin, movies.hasAuthorization, movies.delete);

    // Books api Routea
    app.route('/api/movies/latest')
        .get(users.requiresLogin, movies.getLatestMovie);

    app.route('/api/movies/collections')
        .get(users.requiresLogin, movies.getCollectionsList);

    app.route('/api/movies/names')
        .get(users.requiresLogin, movies.getCollectionNames);

    // Finish by binding the Movie middleware
    app.param('movieId', movies.movieByID);
};
