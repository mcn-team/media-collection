'use strict';

const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        unique: true
    },
    answer: String
}, { _id: false });

const MediaSchema = new mongoose.Schema({
    mediaId: mongoose.Schema.ObjectId,
    field: String
}, { _id: false });

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
        },
        feedInterval: Number
    },
    recovery: {
        questions: [QuestionSchema],
        medias: [MediaSchema],
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
