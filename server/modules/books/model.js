'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    title: {
        type: String,
        default: '',
        trim: true
    },
    type: {
        type: String,
        default: 'book',
        required: 'Media type is required'
    },
    collectionName: {
        type: String,
        trim: true
    },
    volume: Number,
    authors: [
        String
    ],
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
        required: 'Reading status is required',
        default: 'NOTREAD'
    },
    bought: {
        type: Boolean,
        default: true,
        required: 'Purchase status is required'
    },
    pageCount: {
        type: String,
        default: '0'
    },
    bookRate: {
        type: Number,
        default: 0
    },
    summary: String,
    price: String,
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

mongoose.model('Book', bookSchema);
