// const { default: mongoose } = require('mongoose');
const mongoose = require("mongoose");

// Schema
const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'please add post title']
    },
    description: {
        type: String,
        required: [true, 'please add psot description']
    },
    postedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        require: true,
    },
}, { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);