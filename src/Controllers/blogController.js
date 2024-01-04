const Blog = require('../Models/blogModel');
const path = require ('path');
const fs = require('fs');


// post method blog
exports.createBlog = async (req, res) => {
    try{
        /* if(!req.file || req.file.filename){
            return res.status(400).json({message: 'Please upload a file'});
        } */
        // add form data as blog objects
        const blog = new Blog({
            title: req.body.title,
            content: req.body.content,
            imagePath: req.file.filename,
            creator: req.body.creator,
            Category: req.body.Category,
        });
        const result = await blog.save(); // blog save 
        res.status(201).json({
            message: 'Blog created successfully', // response data with status
            blog: result,
        });
        } catch(err){ // error check occure
            res.status(500).json({message: err.message}); // send error response 
        }
    
    };



// blog get method
exports.getBlog = async (req, res) => {
    try{
        const blog = await Blog.find(); // find blog from db
        //check blog is store or not
        if(!blog){
            return res.status(404).json({message: 'Blog not found'}); // send error response
        }
        res.status(200).json(blog);// send blog data with status
    }
    catch(err){ // check error occure
        res.status(500).json({message: err.message}); // send error response
    }
};


// get specific blog
exports.viewBlog = async (req,res) => {
    try{
        const {id} = req.params; // get blog id as param
        const blog = await Blog.findById(id); // find blog is stored in db
        //check stored or not
        if(!blog){
            return res.status(404).json({message: 'Blog not found'}); // send error response 
        }
        // Increment views
        blog.views += 1;
        await blog.save();
        res.status(200).json(blog); // send data with status
    }
    catch(err){ // check error occur
        res.status(500).json({message: err.message}); /// send error response 
    }
};


// get userBlog 
exports.getUserBlog = async (req,res) =>{
    try{
        const {id} = req.params; // get blog id as param
        const blog = await Blog.find({creator: id}); // find blog creator using id
        //check stored or not
        if(!blog){
            return res.status(404).json({message: 'Blog not found'});// send error response 
        }
        res.status(200).json(blog); // send data with response
    }
    catch(err){ // check error occured 
        res.status(500).json({message: err.message}); // send server error response
    }
};


// update blog
exports.updateBlog = async (req, res)=> {
    try{
        const {id} = req.params; // get blog id as param
        const {
            title,
            content,
            imagePath,
            creator,
            Category
        } = req.body; // get blog data value in body

        // pass the body values to object
        const updateBlog = {
            title:title,
            content:content,
            imagePath:imagePath,
            creator:creator,
            Category:Category,
        };
        // check image is upload or not
        if(req.file){
            updateBlog.imagePath = req.file.filename;
            updateBlog.mimetype = req.file.mimetype;
        }
        // update blog using id
        let result = await Blog.findByIdAndUpdate(id,updateBlog,{new:true}); 
        // check blog is updated or not
         if(!result){
                return res.status(404).json({message: 'Blog not found'}); // send response error
         }
            res.status(200).json({message: 'Blog updated successfully',blog:result}); // send status with data
        }
        catch(err){ // check server error occur
            res.status(500).json({message: err.message}); // send error
        }
    };


// delete blog
exports.deleteBlog = async (req, res) => {
    try{
        const {id} = req.params; // get blog id as param
        const blog = await Blog.findByIdAndDelete(id); // find blog using id
        // check blog is stored or not
        if(!blog){
            return res.status(404).json({message: 'Blog not found'});// send error 
        }
        // check the blog file is stored or not
        if (!blog.file) {
            return res.status(400).json({ message: 'File not found for the blog' }); //send error
          }
        // delete file from server
        const filePath = path.resolve('uploads','blogs',blog.file);
        console.log('filePath:', filePath);
        //delete the file from server 
        fs.unlink(filePath, (err) => {
            // check error
         if (err) {
          console.error('unlink error:', err);
          return res.status(500).json({ msg: 'Failed to delete file' }); // send error 
            }
            console.log(`File ${filePath} deleted successfully`); // send response with file path
      });
        res.status(200).json({message: 'Blog deleted successfully'}); // send staus with msg
    }
    catch(err){ // check error occur
        res.status(500).json({message: err.message}); // send error server
    }

};


