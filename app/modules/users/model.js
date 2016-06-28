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
    admin: {
        type: Boolean,
        default: false
    },
    options: {
        language: {
            type: String,
            default: 'en'
        }
    },
    recovery: {
        questions: [{
            question: String,
            answer: String
        }],
        medias: [{
            mediaId: mongoose.Schema.ObjectId,
            field: String
        }],
        method: {
            type: String,
            enum: [ 'questions', 'medias' ]
        }
    },
    created: {
        type: Date,
        default: Date.now
    }
});

exports.model = mongoose.model('User', UserSchema);
