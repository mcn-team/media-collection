'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const authorSchema = new Schema({
    name: String
});

mongoose.model('Author', authorSchema);
