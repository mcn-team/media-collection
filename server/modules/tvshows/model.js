'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TvShowSchema = new Schema({
    type: {
        type: String,
        enum: [ 'tvshows', 'animes'],
        default: 'tvshows'
    },
    name: String,
    seriesRate: {
        type: Number,
        default: 0
    },
    seen: {
        type: String,
        enum: [ 'NOTSEEN', 'ONGOING', 'SEEN'],
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
}, { collection: 'series' });

mongoose.model('TvShow', TvShowSchema);
