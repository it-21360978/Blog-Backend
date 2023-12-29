const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
        required: true,
    },
    replies: [{
        text: {
            type: String,
            required: true,
        },
        user: {
            type:mongoose.Schema.Types.ObjectId, 
            ref: "User",
            required: true,
        },
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;