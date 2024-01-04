const mongoose = require ('mongoose');
const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        trim: true,
    },
    author: {
        type: String, 
        required: true,
    },
    replies: [{
        reply: {
          type: String,
          required: true,
        },
        owner: {
          type: String,
          required: true,
        },
      }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});


const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
    },
    content: {
        type: String,
        required: true,
        trim: true,
        minlength:5,
    },
    imagePath: {
        type: String,
        required: true,
        trim: true,
        minlength:3,
    },
    creator: {
       // type: //mongoose.Schema.Types.ObjectId,
        //ref: "User",
        type: String,
        required: true,
    },
    Category:{
        type: String,
        required: true,
    },
    comments: [commentSchema],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    views: {
        type: Number,
        default: 0, // Initial views count
      },
});
blogSchema.method("isAuthor", function(user) {
    return user && user._id.toString() === this.creator.toString();
}
);
const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;
