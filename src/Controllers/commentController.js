const Blog = require('../Models/blogModel')

//comment post method
exports.createComment = async (req, res) => {
    try {
    //get text ,author in body
      const { text, author } = req.body;
      const postId = req.params.id; // get blog id in parameter
        // Check if the blog post exists
      const blogPost = await Blog.findById(postId);
      //check the blog is stored or not
      if (!blogPost) {
        return res.status(404).json({ error: `Blog post not found` }); // if blog not stored , response the error
      }
        //push the comment in blog db
      blogPost.comments.push({ text, author });
        //save the blog
      await blogPost.save();
  // send the success response
      res.status(201).json(blogPost);

    } catch (error) { // if has error
      console.error(error); 
      res.status(500).json({ error: 'Internal Server Error' });// response error msg
    }
  };


// get all comments
  exports.allComments = async(req,res)=>{
    try {
        // get blog id in parameter
        const postId = req.params.id;
        
        // Check if the blog post exists
        const blogPost = await Blog.findById(postId);
        //check blog is stored in db 
        if (!blogPost) {
          return res.status(404).json({ error: `Blog post with ID ${postId} not found` }); // send the response error with id
        }
    
        // Retrieve and send all comments 
        const allComments = blogPost.comments;
        res.status(200).json(allComments);// send the response status
      } catch (error) { // check error occur
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' }); // response error 
      }
    };
    

  
    // put method for comment
    exports.updateComment = async (req, res) => {
        try {
        const { text, author } = req.body; // text and author get in body
        const postId = req.params.id; // get id as a parmeter
        const commentId = req.params.commentId; // get comment id as param
        
        // Check if the blog post exists
        const blogPost = await Blog.findById(postId);
            // checking blog
        if (!blogPost) {
            return res.status(404).json({ error: `Blog post with ID ${postId} not found` }); // send error response with id 
        }
        // Find the id of the comment to be updated 
        const comment = blogPost.comments.id(commentId);
        // check comment is stored or not
        if (!comment) {
            return res.status(404).json({ error: `Comment with ID ${commentId} not found` });// send error response with id
        }
        // Update the comment
        comment.text = text;
        comment.author = author;
        //save  blog
        await blogPost.save();
        res.status(200).json(blogPost); // response the status with data
        } catch (error) { // check error occur
        console.error(error); 
        res.status(500).json({ error: 'Internal Server Error' }); // response error 
        }
    };


    // delete method for comment
    exports.deleteComment = async (req, res) => {
        try {
        const postId = req.params.id; // get blog id as a parameter
        const commentId = req.params.commentId; // get comment id as param
        // Get the blog post from the database
        const blogPost = await Blog.findById(postId);
        // check blog is stored or not
        if (!blogPost) {
            return res.status(404).json({ error: `Blog post with ID ${postId} not found` }); // send response error with id
        }
        // Find the comment to be deleted
        const comment = blogPost.comments.id(commentId);
        // check comment is stored or not
        if (!comment) {
            return res.status(404).json({ error: `Comment with ID ${commentId} not found` }); // send error response with id
        }
        // Delete the comment
        comment.remove();
        
        await blogPost.save();
        res.status(200).json(blogPost); // send response staus with data and save blog
        
    } catch (error) { // check error occure
        console.error(error); 
        res.status(500).json({ error: 'Internal Server Error' }); // send server error response
        }
    };


// post method to reply 
    exports.createReply = async (req, res) => {
        try {
        // get reply and owner in body
        const { reply, owner } = req.body;
        const postId = req.params.id; // get post id as param
        const commentId = req.params.commentId; //get comnt id as param
        // find the blog post 
        const blogPost = await Blog.findById(postId);
        // check blog is stored or not
        if (!blogPost) {
            return res.status(404).json({ error: `Blog post not found` });// send error response 
        }
       
        // Find the comment to be reply
        const comment = blogPost.comments.id(commentId);
        // check comment is stored or not
        if (!comment) {
            return res.status(404).json({ error: `Comment not found` });// send response error
        }
        // Push the reply to comment array
        comment.replies.push({ reply, owner });
    
        await blogPost.save();// blog saved
    
        res.status(201).json(blogPost); //send response with data
        
    } catch (error) { // check error occure
        console.error(error); 
        res.status(500).json({ error: 'Internal Server Error' }); // send server error respose
        }
    };


    //put method for reply
    exports.updateReply = async (req, res) => {
        try {
        const { reply , owner } = req.body; // get reply ,owner as body
        const postId = req.params.id; // get postid and cmnt id as param
        const commentId = req.params.commentId;
        const replyId = req.params.replyId; // get reply id as param
        // find the blog post
        const blogPost = await Blog.findById(postId);
        // check blog is stored or not
        if (!blogPost) {
            return res.status(404).json({ error: `Blog post with ID ${postId} not found` });// send error response
        }
        // Find the comment to be updated
        const comment = blogPost.comments.id(commentId);
        // check comment is stored or not
        if (!comment) {
            return res.status(404).json({ error: `Comment with ID ${commentId} not found` }); // send error response
        }
        // Find the reply to be updated
        const Reply = comment.replies.id(replyId);
        // check reply is stored or not
        if (!Reply) {
            return res.status(404).json({ error: `Reply with ID ${replyId} not found` }); // send error
        }
        // Update the reply
        reply.reply = reply;
        reply.owner = owner;
    
        await blogPost.save();// save the blog 
    
        res.status(200).json(blogPost);// send response with data
        } catch (error) {
        console.error(error); 
        res.status(500).json({ error: 'Internal Server Error' }); // server error
        }
    };



    
    exports.deleteReply = async (req, res) => {
        try {
        const postId = req.params.id; 
        const commentId = req.params.commentId; 
        const replyId = req.params.replyId; 
    
        const blogPost = await Blog.findById(postId);
    
        if (!blogPost) {
            return res.status(404).json({ error: `Blog post with ID ${postId} not found` });
        }
    
        const comment = blogPost.comments.id(commentId);
    
        if (!comment) {
            return res.status(404).json({ error: `Comment with ID ${commentId} not found` });
        }
    
        const reply = comment.replies.id(replyId);
    
        if (!reply) {
            return res.status(404).json({ error: `Reply with ID ${replyId} not found` });
        }
    
        reply.remove();
    
        await blogPost.save();
    
        res.status(200).json(blogPost);
        } catch (error) {
        console.error(error); 
        res.status(500).json({ error: 'Internal Server Error' });
        }
    };

    exports.getReplies = async (req, res) => {
        try {
        const postId = req.params.id; // Change this to match your route parameter
        const commentId = req.params.commentId; // Change this to match your route parameter
    
        const blogPost = await Blog.findById(postId);
    
        if (!blogPost) {
            return res.status(404).json({ error: `Blog post with ID ${postId} not found` });
        }
    
        const comment = blogPost.comments.id(commentId);
    
        if (!comment) {
            return res.status(404).json({ error: `Comment with ID ${commentId} not found` });
        }
    
        res.status(200).json(comment.replies);
        } catch (error) {
        console.error(error); // Log the error for debugging purposes
        res.status(500).json({ error: 'Internal Server Error' });
        }
    };


    exports.getReplyById = async (req, res) => {
        try {
        const postId = req.params.id; // Change this to match your route parameter
        const commentId = req.params.commentId; // Change this to match your route parameter
        const replyId = req.params.replyId; // Change this to match your route parameter
    
        const blogPost = await Blog.findById(postId);
    
        if (!blogPost) {
            return res.status(404).json({ error: `Blog post with ID ${postId} not found` });
        }
    
        const comment = blogPost.comments.id(commentId);
    
        if (!comment) {
            return res.status(404).json({ error: `Comment with ID ${commentId} not found` });
        }
    
        const reply = comment.replies.id(replyId);
    
        if (!reply) {
            return res.status(404).json({ error: `Reply with ID ${replyId} not found` });
        }
    
        res.status(200).json(reply);
        } catch (error) {
        console.error(error); // Log the error for debugging purposes
        res.status(500).json({ error: 'Internal Server Error' });
        }
    };





