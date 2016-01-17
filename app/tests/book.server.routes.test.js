'use strict';

var should = require('should'),
    request = require('supertest'),
    app = require('../../server'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Book = mongoose.model('Book'),
    agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, book;

/**
 * Book routes tests
 */
describe('Book CRUD tests', function() {
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

        // Save a user to the test db and create new Book
        user.save(function() {
            book = {
                name: 'Book Name'
            };

            done();
        });
    });

    it('should be able to save Book instance if logged in', function(done) {
        agent.post('/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function(signinErr, signinRes) {
                // Handle signin error
                if (signinErr) done(signinErr);

                // Get the userId
                var userId = user.id;

                // Save a new Book
                agent.post('/books')
                    .send(book)
                    .expect(200)
                    .end(function(bookSaveErr, bookSaveRes) {
                        // Handle Book save error
                        if (bookSaveErr) done(bookSaveErr);

                        // Get a list of Books
                        agent.get('/books')
                            .end(function(booksGetErr, booksGetRes) {
                                // Handle Book save error
                                if (booksGetErr) done(booksGetErr);

                                // Get Books list
                                var books = booksGetRes.body;

                                // Set assertions
                                (books[0].user._id).should.equal(userId);
                                (books[0].name).should.match('Book Name');

                                // Call the assertion callback
                                done();
                            });
                    });
            });
    });

    it('should not be able to save Book instance if not logged in', function(done) {
        agent.post('/books')
            .send(book)
            .expect(401)
            .end(function(bookSaveErr, bookSaveRes) {
                // Call the assertion callback
                done(bookSaveErr);
            });
    });

    it('should not be able to save Book instance if no name is provided', function(done) {
        // Invalidate name field
        book.name = '';

        agent.post('/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function(signinErr, signinRes) {
                // Handle signin error
                if (signinErr) done(signinErr);

                // Get the userId
                var userId = user.id;

                // Save a new Book
                agent.post('/books')
                    .send(book)
                    .expect(400)
                    .end(function(bookSaveErr, bookSaveRes) {
                        // Set message assertion
                        (bookSaveRes.body.message).should.match('Please fill Book name');

                        // Handle Book save error
                        done(bookSaveErr);
                    });
            });
    });

    it('should be able to update Book instance if signed in', function(done) {
        agent.post('/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function(signinErr, signinRes) {
                // Handle signin error
                if (signinErr) done(signinErr);

                // Get the userId
                var userId = user.id;

                // Save a new Book
                agent.post('/books')
                    .send(book)
                    .expect(200)
                    .end(function(bookSaveErr, bookSaveRes) {
                        // Handle Book save error
                        if (bookSaveErr) done(bookSaveErr);

                        // Update Book name
                        book.name = 'WHY YOU GOTTA BE SO MEAN?';

                        // Update existing Book
                        agent.put('/books/' + bookSaveRes.body._id)
                            .send(book)
                            .expect(200)
                            .end(function(bookUpdateErr, bookUpdateRes) {
                                // Handle Book update error
                                if (bookUpdateErr) done(bookUpdateErr);

                                // Set assertions
                                (bookUpdateRes.body._id).should.equal(bookSaveRes.body._id);
                                (bookUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                                // Call the assertion callback
                                done();
                            });
                    });
            });
    });

    it('should be able to get a list of Books if not signed in', function(done) {
        // Create new Book model instance
        var bookObj = new Book(book);

        // Save the Book
        bookObj.save(function() {
            // Request Books
            request(app).get('/books')
                .end(function(req, res) {
                    // Set assertion
                    res.body.should.be.an.Array.with.lengthOf(1);

                    // Call the assertion callback
                    done();
                });

        });
    });


    it('should be able to get a single Book if not signed in', function(done) {
        // Create new Book model instance
        var bookObj = new Book(book);

        // Save the Book
        bookObj.save(function() {
            request(app).get('/books/' + bookObj._id)
                .end(function(req, res) {
                    // Set assertion
                    res.body.should.be.an.Object.with.property('name', book.name);

                    // Call the assertion callback
                    done();
                });
        });
    });

    it('should be able to delete Book instance if signed in', function(done) {
        agent.post('/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function(signinErr, signinRes) {
                // Handle signin error
                if (signinErr) done(signinErr);

                // Get the userId
                var userId = user.id;

                // Save a new Book
                agent.post('/books')
                    .send(book)
                    .expect(200)
                    .end(function(bookSaveErr, bookSaveRes) {
                        // Handle Book save error
                        if (bookSaveErr) done(bookSaveErr);

                        // Delete existing Book
                        agent.delete('/books/' + bookSaveRes.body._id)
                            .send(book)
                            .expect(200)
                            .end(function(bookDeleteErr, bookDeleteRes) {
                                // Handle Book error error
                                if (bookDeleteErr) done(bookDeleteErr);

                                // Set assertions
                                (bookDeleteRes.body._id).should.equal(bookSaveRes.body._id);

                                // Call the assertion callback
                                done();
                            });
                    });
            });
    });

    it('should not be able to delete Book instance if not signed in', function(done) {
        // Set Book user
        book.user = user;

        // Create new Book model instance
        var bookObj = new Book(book);

        // Save the Book
        bookObj.save(function() {
            // Try deleting Book
            request(app).delete('/books/' + bookObj._id)
            .expect(401)
            .end(function(bookDeleteErr, bookDeleteRes) {
                // Set message assertion
                (bookDeleteRes.body.message).should.match('User is not logged in');

                // Handle Book error error
                done(bookDeleteErr);
            });

        });
    });

    afterEach(function(done) {
        User.remove().exec();
        Book.remove().exec();
        done();
    });
});