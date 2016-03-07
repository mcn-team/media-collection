'use strict';

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username : {
        type: String,
        unique: true
    },
    password : String,
    displayName: String,
    email: String,
    options: {
        language: {
            type: String,
            default: 'en'
        }
    },
    created: {
        type: Date,
        default: Date.now
    }
});

exports.model = mongoose.model('User', UserSchema);
