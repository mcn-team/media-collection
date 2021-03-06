'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const movieSchema = new Schema({
    title: String,
    type: String,
    movieRate: {
        type: Number,
        default: 0
    },
    collectionName: String,
    episode: Number,
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
    lastElement: {
        type: Boolean,
        default: false
    },
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
