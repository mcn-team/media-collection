'use strict';

var should = require('should'),
    request = require('supertest'),
    app = require('../../server'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    TvShow = mongoose.model('TvShow'),
    agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, tvShow;

/**
 * Tv show routes tests
 */
describe('Tv show CRUD tests', function() {
    beforeEach(function(done) {
        // Create user credentials
        credentials = {
            username: 'username',
            password: 'password'
        };

        // Create a new user
        user = new User({
            firstName: 'Full',
            lastName: 'Name',
            displayName: 'Full Name',
            email: 'test@test.com',
            username: credentials.username,
            password: credentials.password,
            provider: 'local'
        });

        // Save a user to the test db and create new Tv show
        user.save(function() {
            tvShow = {
                name: 'Tv show Name'
            };

            done();
        });
    });

    it('should be able to save Tv show instance if logged in', function(done) {
        agent.post('/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function(signinErr, signinRes) {
                // Handle signin error
                if (signinErr) done(signinErr);

                // Get the userId
                var userId = user.id;

                // Save a new Tv show
                agent.post('/tv-shows')
                    .send(tvShow)
                    .expect(200)
                    .end(function(tvShowSaveErr, tvShowSaveRes) {
                        // Handle Tv show save error
                        if (tvShowSaveErr) done(tvShowSaveErr);

                        // Get a list of Tv shows
                        agent.get('/tv-shows')
                            .end(function(tvShowsGetErr, tvShowsGetRes) {
                                // Handle Tv show save error
                                if (tvShowsGetErr) done(tvShowsGetErr);

                                // Get Tv shows list
                                var tvShows = tvShowsGetRes.body;

                                // Set assertions
                                (tvShows[0].user._id).should.equal(userId);
                                (tvShows[0].name).should.match('Tv show Name');

                                // Call the assertion callback
                                done();
                            });
                    });
            });
    });

    it('should not be able to save Tv show instance if not logged in', function(done) {
        agent.post('/tv-shows')
            .send(tvShow)
            .expect(401)
            .end(function(tvShowSaveErr, tvShowSaveRes) {
                // Call the assertion callback
                done(tvShowSaveErr);
            });
    });

    it('should not be able to save Tv show instance if no name is provided', function(done) {
        // Invalidate name field
        tvShow.name = '';

        agent.post('/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function(signinErr, signinRes) {
                // Handle signin error
                if (signinErr) done(signinErr);

                // Get the userId
                var userId = user.id;

                // Save a new Tv show
                agent.post('/tv-shows')
                    .send(tvShow)
                    .expect(400)
                    .end(function(tvShowSaveErr, tvShowSaveRes) {
                        // Set message assertion
                        (tvShowSaveRes.body.message).should.match('Please fill Tv show name');

                        // Handle Tv show save error
                        done(tvShowSaveErr);
                    });
            });
    });

    it('should be able to update Tv show instance if signed in', function(done) {
        agent.post('/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function(signinErr, signinRes) {
                // Handle signin error
                if (signinErr) done(signinErr);

                // Get the userId
                var userId = user.id;

                // Save a new Tv show
                agent.post('/tv-shows')
                    .send(tvShow)
                    .expect(200)
                    .end(function(tvShowSaveErr, tvShowSaveRes) {
                        // Handle Tv show save error
                        if (tvShowSaveErr) done(tvShowSaveErr);

                        // Update Tv show name
                        tvShow.name = 'WHY YOU GOTTA BE SO MEAN?';

                        // Update existing Tv show
                        agent.put('/tv-shows/' + tvShowSaveRes.body._id)
                            .send(tvShow)
                            .expect(200)
                            .end(function(tvShowUpdateErr, tvShowUpdateRes) {
                                // Handle Tv show update error
                                if (tvShowUpdateErr) done(tvShowUpdateErr);

                                // Set assertions
                                (tvShowUpdateRes.body._id).should.equal(tvShowSaveRes.body._id);
                                (tvShowUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                                // Call the assertion callback
                                done();
                            });
                    });
            });
    });

    it('should be able to get a list of Tv shows if not signed in', function(done) {
        // Create new Tv show model instance
        var tvShowObj = new TvShow(tvShow);

        // Save the Tv show
        tvShowObj.save(function() {
            // Request Tv shows
            request(app).get('/tv-shows')
                .end(function(req, res) {
                    // Set assertion
                    res.body.should.be.an.Array.with.lengthOf(1);

                    // Call the assertion callback
                    done();
                });

        });
    });


    it('should be able to get a single Tv show if not signed in', function(done) {
        // Create new Tv show model instance
        var tvShowObj = new TvShow(tvShow);

        // Save the Tv show
        tvShowObj.save(function() {
            request(app).get('/tv-shows/' + tvShowObj._id)
                .end(function(req, res) {
                    // Set assertion
                    res.body.should.be.an.Object.with.property('name', tvShow.name);

                    // Call the assertion callback
                    done();
                });
        });
    });

    it('should be able to delete Tv show instance if signed in', function(done) {
        agent.post('/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function(signinErr, signinRes) {
                // Handle signin error
                if (signinErr) done(signinErr);

                // Get the userId
                var userId = user.id;

                // Save a new Tv show
                agent.post('/tv-shows')
                    .send(tvShow)
                    .expect(200)
                    .end(function(tvShowSaveErr, tvShowSaveRes) {
                        // Handle Tv show save error
                        if (tvShowSaveErr) done(tvShowSaveErr);

                        // Delete existing Tv show
                        agent.delete('/tv-shows/' + tvShowSaveRes.body._id)
                            .send(tvShow)
                            .expect(200)
                            .end(function(tvShowDeleteErr, tvShowDeleteRes) {
                                // Handle Tv show error error
                                if (tvShowDeleteErr) done(tvShowDeleteErr);

                                // Set assertions
                                (tvShowDeleteRes.body._id).should.equal(tvShowSaveRes.body._id);

                                // Call the assertion callback
                                done();
                            });
                    });
            });
    });

    it('should not be able to delete Tv show instance if not signed in', function(done) {
        // Set Tv show user
        tvShow.user = user;

        // Create new Tv show model instance
        var tvShowObj = new TvShow(tvShow);

        // Save the Tv show
        tvShowObj.save(function() {
            // Try deleting Tv show
            request(app).delete('/tv-shows/' + tvShowObj._id)
            .expect(401)
            .end(function(tvShowDeleteErr, tvShowDeleteRes) {
                // Set message assertion
                (tvShowDeleteRes.body.message).should.match('User is not logged in');

                // Handle Tv show error error
                done(tvShowDeleteErr);
            });

        });
    });

    afterEach(function(done) {
        User.remove().exec();
        TvShow.remove().exec();
        done();
    });
});