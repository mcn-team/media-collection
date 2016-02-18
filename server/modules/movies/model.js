'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const movieSchema = new Schema({
    title: {
        type: String,
        default: '',
        required: 'Please fill movie Title',
        trim: true
    },

    type: {
        type: String,
        required: 'Type field is missing'
    },

    movieRate: {
        type: Number,
        default: 0
    },

    collectionName: {
        type: String,
        default: '',
        trim: true
    },

    episode: {
        type: Number,
        required: 'Episode field is missing'
    },

    directors: [ String ],

    producers: [ String ],

    scenarists: [ String ],

    actors: [ String ],

    price: Number,

    duration: Number,

    releasedDate: {
        type: Date,
        default: null
    },

    seen: {
        type: Boolean,
        required: 'Status field is missing',
        default: false
    },

    bought: {
        type: Boolean,
        required: 'Bought field is missing',
        default: false
    },

    cover: {
        type: String,
        trim: true
    },

    summary: {
        type: String,
        trim: true
    },

    customFields: [{
        name: String,
        value: String
    }],

    created: {
        type: Date,
        default: Date.now
    },

    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

mongoose.model('Movie', movieSchema);
