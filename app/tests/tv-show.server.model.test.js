'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    TvShow = mongoose.model('TvShow');

/**
 * Globals
 */
var user, tvShow;

/**
 * Unit tests
 */
describe('Tv show Model Unit Tests:', function() {
    beforeEach(function(done) {
        user = new User({
            firstName: 'Full',
            lastName: 'Name',
            displayName: 'Full Name',
            email: 'test@test.com',
            username: 'username',
            password: 'password'
        });

        user.save(function() {
            tvShow = new TvShow({
                name: 'Tv show Name',
                user: user
            });

            done();
        });
    });

    describe('Method Save', function() {
        it('should be able to save without problems', function(done) {
            return tvShow.save(function(err) {
                should.not.exist(err);
                done();
            });
        });

        it('should be able to show an error when try to save without name', function(done) {
            tvShow.name = '';

            return tvShow.save(function(err) {
                should.exist(err);
                done();
            });
        });
    });

    afterEach(function(done) {
        TvShow.remove().exec();
        User.remove().exec();

        done();
    });
});