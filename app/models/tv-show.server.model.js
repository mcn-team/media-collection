'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Tv show Schema
 */
var TvShowSchema = new Schema({
    tvShowName: {
        type: String,
        required: 'Please enter the name of the TV Show',
        trim: true
    },

    tvShowRate: {
        type: Number,
        default: 0
    },

    season: {
        type: Number,
        required: 'Please enter the season number'
    },

    episodes: {
        type: Number,
        required: 'Please enter the number of episodes'
    },

    lastSeen: Number,

    seen: {
        type: String,
        default: 'NOTSEEN'
    },

    bought: {
        type: Boolean,
        default: false
    },

    year: Number,

    cover: String,

    price: String,

    producers: [String],

    creators: [String],

    actors: [String],

    channel: String,

    duration: Number,

    summary: String,

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

mongoose.model('TvShow', TvShowSchema);
