const mongoose = require ('mongoose');

const feedbackSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength:5,
    },
    subject:{
        type: String,
        required: true,
        trim: true,
        minlength:5,
    },
    message: {
        type: String,
        required: true,
        trim: true,
        minlength:3,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Feedback = mongoose.model('Feedback', feedbackSchema);
module.exports= Feedback;