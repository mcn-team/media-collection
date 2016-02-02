'use strict';

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username : {
        type: String,
        trim: true,
        unique: true,
        required: 'Login required'
    },
    password : {
        type: String,
        trim: true,
        required: 'Password required'
    },
    firstName: {
        type: String,
        trim: true,
        default: ''
    },
    lastName: {
        type: String,
        trim: true,
        default: ''
    },
    displayName: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        default: '',
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UserSchema);
