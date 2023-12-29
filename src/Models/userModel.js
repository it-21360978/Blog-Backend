 const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    imagePath
    : {
        type: String,
        trim: true,
       // minlength: 5,
    },
    username
    : {
        type: String,
        required: true,
        trim: true,
        minlength: 4,
        unique:true,
    },
    email
    : {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
        unique:true,
    },
    password
    : {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
        unique:true,
    },
    createdAt
    : {
        type: Date,
        default: Date.now,
    },
});
const User = mongoose.model('User', userSchema);
module.exports = User;