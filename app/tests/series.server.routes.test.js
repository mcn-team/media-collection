'use strict';

var should = require('should'),
    request = require('supertest'),
    app = require('../../server'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Series = mongoose.model('Series'),
    agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, series;

/**
 * Series routes tests
 */
describe('Series CRUD tests', function() {
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

        // Save a user to the test db and create new Series
        user.save(function() {
            series = {
                name: 'Series Name'
            };

            done();
        });
    });

    it('should be able to save Series instance if logged in', function(done) {
        agent.post('/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function(signinErr, signinRes) {
                // Handle signin error
                if (signinErr) done(signinErr);

                // Get the userId
                var userId = user.id;

                // Save a new Series
                agent.post('/series')
                    .send(series)
                    .expect(200)
                    .end(function(seriesSaveErr, seriesSaveRes) {
                        // Handle Series save error
                        if (seriesSaveErr) done(seriesSaveErr);

                        // Get a list of Series
                        agent.get('/series')
                            .end(function(seriesGetErr, seriesGetRes) {
                                // Handle Series save error
                                if (seriesGetErr) done(seriesGetErr);

                                // Get Series list
                                var series = seriesGetRes.body;

                                // Set assertions
                                (series[0].user._id).should.equal(userId);
                                (series[0].name).should.match('Series Name');

                                // Call the assertion callback
                                done();
                            });
                    });
            });
    });

    it('should not be able to save Series instance if not logged in', function(done) {
        agent.post('/series')
            .send(series)
            .expect(401)
            .end(function(seriesSaveErr, seriesSaveRes) {
                // Call the assertion callback
                done(seriesSaveErr);
            });
    });

    it('should not be able to save Series instance if no name is provided', function(done) {
        // Invalidate name field
        series.name = '';

        agent.post('/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function(signinErr, signinRes) {
                // Handle signin error
                if (signinErr) done(signinErr);

                // Get the userId
                var userId = user.id;

                // Save a new Series
                agent.post('/series')
                    .send(series)
                    .expect(400)
                    .end(function(seriesSaveErr, seriesSaveRes) {
                        // Set message assertion
                        (seriesSaveRes.body.message).should.match('Please fill Series name');

                        // Handle Series save error
                        done(seriesSaveErr);
                    });
            });
    });

    it('should be able to update Series instance if signed in', function(done) {
        agent.post('/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function(signinErr, signinRes) {
                // Handle signin error
                if (signinErr) done(signinErr);

                // Get the userId
                var userId = user.id;

                // Save a new Series
                agent.post('/series')
                    .send(series)
                    .expect(200)
                    .end(function(seriesSaveErr, seriesSaveRes) {
                        // Handle Series save error
                        if (seriesSaveErr) done(seriesSaveErr);

                        // Update Series name
                        series.name = 'WHY YOU GOTTA BE SO MEAN?';

                        // Update existing Series
                        agent.put('/series/' + seriesSaveRes.body._id)
                            .send(series)
                            .expect(200)
                            .end(function(seriesUpdateErr, seriesUpdateRes) {
                                // Handle Series update error
                                if (seriesUpdateErr) done(seriesUpdateErr);

                                // Set assertions
                                (seriesUpdateRes.body._id).should.equal(seriesSaveRes.body._id);
                                (seriesUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                                // Call the assertion callback
                                done();
                            });
                    });
            });
    });

    it('should be able to get a list of Series if not signed in', function(done) {
        // Create new Series model instance
        var seriesObj = new Series(series);

        // Save the Series
        seriesObj.save(function() {
            // Request Series
            request(app).get('/series')
                .end(function(req, res) {
                    // Set assertion
                    res.body.should.be.an.Array.with.lengthOf(1);

                    // Call the assertion callback
                    done();
                });

        });
    });


    it('should be able to get a single Series if not signed in', function(done) {
        // Create new Series model instance
        var seriesObj = new Series(series);

        // Save the Series
        seriesObj.save(function() {
            request(app).get('/series/' + seriesObj._id)
                .end(function(req, res) {
                    // Set assertion
                    res.body.should.be.an.Object.with.property('name', series.name);

                    // Call the assertion callback
                    done();
                });
        });
    });

    it('should be able to delete Series instance if signed in', function(done) {
        agent.post('/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function(signinErr, signinRes) {
                // Handle signin error
                if (signinErr) done(signinErr);

                // Get the userId
                var userId = user.id;

                // Save a new Series
                agent.post('/series')
                    .send(series)
                    .expect(200)
                    .end(function(seriesSaveErr, seriesSaveRes) {
                        // Handle Series save error
                        if (seriesSaveErr) done(seriesSaveErr);

                        // Delete existing Series
                        agent.delete('/series/' + seriesSaveRes.body._id)
                            .send(series)
                            .expect(200)
                            .end(function(seriesDeleteErr, seriesDeleteRes) {
                                // Handle Series error error
                                if (seriesDeleteErr) done(seriesDeleteErr);

                                // Set assertions
                                (seriesDeleteRes.body._id).should.equal(seriesSaveRes.body._id);

                                // Call the assertion callback
                                done();
                            });
                    });
            });
    });

    it('should not be able to delete Series instance if not signed in', function(done) {
        // Set Series user
        series.user = user;

        // Create new Series model instance
        var seriesObj = new Series(series);

        // Save the Series
        seriesObj.save(function() {
            // Try deleting Series
            request(app).delete('/series/' + seriesObj._id)
            .expect(401)
            .end(function(seriesDeleteErr, seriesDeleteRes) {
                // Set message assertion
                (seriesDeleteRes.body.message).should.match('User is not logged in');

                // Handle Series error error
                done(seriesDeleteErr);
            });

        });
    });

    afterEach(function(done) {
        User.remove().exec();
        Series.remove().exec();
        done();
    });
});