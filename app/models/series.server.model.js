'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Series Schema
 */
var SeriesSchema = new Schema({
    type: {
        type: String,
        default: 'tvshows'
    },
    series: {
        type: String,
        default: '',
        required: 'Please fill Series name',
        trim: true
    },
    seriesRate: {
        type: Number,
        default: 0
    },
    seen: {
        type: String,
        default: 'NOTSEEN'
    },
    bought: {
        type: Boolean,
        default: false
    },
    seasons: [{
        seasonId: Number,
        episodes: Number
    }],
    lastSeenSeason: Number,
    lastSeenEp: Number,
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

mongoose.model('Series', SeriesSchema);
