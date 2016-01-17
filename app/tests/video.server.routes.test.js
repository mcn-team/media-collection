'use strict';

var should = require('should'),
    request = require('supertest'),
    app = require('../../server'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Video = mongoose.model('Video'),
    agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, video;

/**
 * Video routes tests
 */
describe('Video CRUD tests', function() {
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

        // Save a user to the test db and create new Video
        user.save(function() {
            video = {
                name: 'Video Name'
            };

            done();
        });
    });

    it('should be able to save Video instance if logged in', function(done) {
        agent.post('/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function(signinErr, signinRes) {
                // Handle signin error
                if (signinErr) done(signinErr);

                // Get the userId
                var userId = user.id;

                // Save a new Video
                agent.post('/videos')
                    .send(video)
                    .expect(200)
                    .end(function(videoSaveErr, videoSaveRes) {
                        // Handle Video save error
                        if (videoSaveErr) done(videoSaveErr);

                        // Get a list of Videos
                        agent.get('/videos')
                            .end(function(videosGetErr, videosGetRes) {
                                // Handle Video save error
                                if (videosGetErr) done(videosGetErr);

                                // Get Videos list
                                var videos = videosGetRes.body;

                                // Set assertions
                                (videos[0].user._id).should.equal(userId);
                                (videos[0].name).should.match('Video Name');

                                // Call the assertion callback
                                done();
                            });
                    });
            });
    });

    it('should not be able to save Video instance if not logged in', function(done) {
        agent.post('/videos')
            .send(video)
            .expect(401)
            .end(function(videoSaveErr, videoSaveRes) {
                // Call the assertion callback
                done(videoSaveErr);
            });
    });

    it('should not be able to save Video instance if no name is provided', function(done) {
        // Invalidate name field
        video.name = '';

        agent.post('/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function(signinErr, signinRes) {
                // Handle signin error
                if (signinErr) done(signinErr);

                // Get the userId
                var userId = user.id;

                // Save a new Video
                agent.post('/videos')
                    .send(video)
                    .expect(400)
                    .end(function(videoSaveErr, videoSaveRes) {
                        // Set message assertion
                        (videoSaveRes.body.message).should.match('Please fill Video name');

                        // Handle Video save error
                        done(videoSaveErr);
                    });
            });
    });

    it('should be able to update Video instance if signed in', function(done) {
        agent.post('/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function(signinErr, signinRes) {
                // Handle signin error
                if (signinErr) done(signinErr);

                // Get the userId
                var userId = user.id;

                // Save a new Video
                agent.post('/videos')
                    .send(video)
                    .expect(200)
                    .end(function(videoSaveErr, videoSaveRes) {
                        // Handle Video save error
                        if (videoSaveErr) done(videoSaveErr);

                        // Update Video name
                        video.name = 'WHY YOU GOTTA BE SO MEAN?';

                        // Update existing Video
                        agent.put('/videos/' + videoSaveRes.body._id)
                            .send(video)
                            .expect(200)
                            .end(function(videoUpdateErr, videoUpdateRes) {
                                // Handle Video update error
                                if (videoUpdateErr) done(videoUpdateErr);

                                // Set assertions
                                (videoUpdateRes.body._id).should.equal(videoSaveRes.body._id);
                                (videoUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                                // Call the assertion callback
                                done();
                            });
                    });
            });
    });

    it('should be able to get a list of Videos if not signed in', function(done) {
        // Create new Video model instance
        var videoObj = new Video(video);

        // Save the Video
        videoObj.save(function() {
            // Request Videos
            request(app).get('/videos')
                .end(function(req, res) {
                    // Set assertion
                    res.body.should.be.an.Array.with.lengthOf(1);

                    // Call the assertion callback
                    done();
                });

        });
    });


    it('should be able to get a single Video if not signed in', function(done) {
        // Create new Video model instance
        var videoObj = new Video(video);

        // Save the Video
        videoObj.save(function() {
            request(app).get('/videos/' + videoObj._id)
                .end(function(req, res) {
                    // Set assertion
                    res.body.should.be.an.Object.with.property('name', video.name);

                    // Call the assertion callback
                    done();
                });
        });
    });

    it('should be able to delete Video instance if signed in', function(done) {
        agent.post('/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function(signinErr, signinRes) {
                // Handle signin error
                if (signinErr) done(signinErr);

                // Get the userId
                var userId = user.id;

                // Save a new Video
                agent.post('/videos')
                    .send(video)
                    .expect(200)
                    .end(function(videoSaveErr, videoSaveRes) {
                        // Handle Video save error
                        if (videoSaveErr) done(videoSaveErr);

                        // Delete existing Video
                        agent.delete('/videos/' + videoSaveRes.body._id)
                            .send(video)
                            .expect(200)
                            .end(function(videoDeleteErr, videoDeleteRes) {
                                // Handle Video error error
                                if (videoDeleteErr) done(videoDeleteErr);

                                // Set assertions
                                (videoDeleteRes.body._id).should.equal(videoSaveRes.body._id);

                                // Call the assertion callback
                                done();
                            });
                    });
            });
    });

    it('should not be able to delete Video instance if not signed in', function(done) {
        // Set Video user
        video.user = user;

        // Create new Video model instance
        var videoObj = new Video(video);

        // Save the Video
        videoObj.save(function() {
            // Try deleting Video
            request(app).delete('/videos/' + videoObj._id)
            .expect(401)
            .end(function(videoDeleteErr, videoDeleteRes) {
                // Set message assertion
                (videoDeleteRes.body.message).should.match('User is not logged in');

                // Handle Video error error
                done(videoDeleteErr);
            });

        });
    });

    afterEach(function(done) {
        User.remove().exec();
        Video.remove().exec();
        done();
    });
});