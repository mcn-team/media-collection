'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Book Schema
 */
var BookSchema = new Schema({
    title: {
        type: String,
        default: '',
        trim: true
    },

    type: {
        type: String,
        default: 'book',
        required: 'Type obligatoire'
    },

    collectionName: {
        type: String,
        default:'',
        trim: true
    },

    volume: {
        type: Number,
        required: 'Volume obligatoire'
    },

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
        required: 'Status de lecture obligatoire',
        default: 'NOTREAD'
    },

    bought: {
        type: Boolean,
        default: true,
        required: 'Status de possession obligatoire'
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

mongoose.model('Book', BookSchema);
