'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Movie Schema
 */
var MovieSchema = new Schema({
    title: {
        type: String,
        default: '',
        required: 'Please fill movie Title',
        trim: true
    },

    type: {
        type: String,
        required: 'Type obligatoire'
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
        required: 'Episode obligatoire'
    },

    directors: {
        type: [ String ]
    },

    producers: {
        type: [ String ]
    },

    scenarists: {
        type: [ String ]
    },

    actors: {
        type: [ String ]
    },

    price: {
        type: Number
    },

    duration: {
        type: Number
    },

    releasedDate: {
        type: Date,
        default: null
    },

    seen: {
        type: Boolean,
        required: 'Status de visionnage obligatoire',
        default: false
    },

    bought: {
        type: Boolean,
        required: 'Status de possession obligatoire',
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

mongoose.model('Movie', MovieSchema);
