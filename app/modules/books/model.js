'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    title: String,
    type: {
        type: String,
        enum: [ 'book', 'comics', 'manga']
    },
    collectionName: String,
    volume: Number,
    authors: [ String ],
    isbn: String,
    publishingDate: {
        type: Date,
        default: null
    },
    publisher: String,
    cover: String,
    read: {
        type: String,
        enum: [ 'NOTREAD', 'ONGOING', 'READ'],
        default: 'NOTREAD'
    },
    bought: {
        type: Boolean,
        default: true
    },
    pageCount: {
        type: Number,
        default: 0
    },
    bookRate: {
        type: Number,
        default: 0
    },
    summary: String,
    price: Number,
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

mongoose.model('Book', bookSchema);
