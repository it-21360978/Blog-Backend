const User = require('../Models/userModel');
const Auth = require ('../Helpers/authService');
const {sendMail} = require ('../Helpers/emailService');
const crypto = require ('crypto')
const jwt = require('jsonwebtoken');
const path = require ('path');
const fs = require('fs');



// post method for user 
exports.register = async(req,res)=>{
    try {
        //get username , email,pw and image as body
        const {username,email,password} = req.body;
        const imagePath = req.file ? req.file.path : '';
        // check user name is inputed or not
        if(!username){
            return res.status(400).json({message: 'Please enter a username'});// send error
        };
        //check email is input or not
        if(!email){
            return res.status(400).json({message: 'Please enter an email'}); // send error
        };
        //check password is input or not and length check
        if(!password || password < 6){
            return res.status(400).json({message: 'Please enter a password'}); //send error
        };
        //check email is already exist or not
        const existUser = await User.findOne({email})
        if(existUser){
            return res.status(400).json({message: 'Email already exists'}); // send error
        }; 
        //hash user input pw
        const hashedPassword = await Auth.hashPassword(password);
        // add form data as user objects
        const user = new User({
            imagePath:imagePath,
            username:username,
            email:email,
            password:hashedPassword
        });
        // save the user to db
        const result = await user.save();
        // send email to user
        await sendMail({
            from: 'ericksera4@gmail.com',
            to:  user.email,
            subject: 'Welcome to Blog App',
            html: `
            <h1>Thank you for registering on our platform</h1>
            <p>Hi ${username},</p>
            <p>You have successfully registered on our platform.</p>
            <p>Best Regards,</p>
            <p>Blog App Team</p>
            `,
            
        });
        res.status(201).json({
            message: 'User Registration successfully', // send response data with status
            user: result,
        });
         
    } catch (error) { // check error occur
        res.status(500).json({message: error.message}); // send error
        
    }
};



// login method
exports.login = async (req, res) => {
    try {
      const { email, password } = req.body; // get email,pw as body
        // check email is input or not
      if(!email){
        return res.status(400).json({message:'please provide an email'}); // send error
      };
        // check pw is input or not
        if(!password){
            return res.status(400).json({message:'please provide a password'});//send error
        };
        // check email is exist or not
        const user = await User.findOne({email:email});
        
      if (!user) {
        return res.status(400).json({ message: 'Invalid Credentials' }); // send error
      }
      // check input pw and db hashedpw is matching or not
      const match = await Auth.passwordCompare(password, user.password);
      if(match){
        /* jwt.sign({email:user.email,id:user._id,username:user.username},process.env.JWT_SECRET,{},(err,token)=>{
            if(err){
                return res.status(400).json({message:'Error creating token'});
            }
           // res.cookie('token',token).json(user);
            res.status(200).json({token},user);
        }) */
        const token = await Auth.generateToken(user); // if match gen token
         res.cookie('token',token).json(user); // send cookie with token and user details
         /* res.status(200).json({token});  */

      };
      //if pw not matched to hashed pw
      if (!match) {
        return res.status(400).json({ message: 'Invalid Credentials' }); // send error
      }
      
      res.status(200); // send success status
    
    } catch (error) { // check error occur
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Internal Server Error' }); // send error response
    }
  };
  


// get method for user
exports.getUser = async (req,res) => {
    try{

        const user = await User.find( // find user 
            {},
            {password: 0}
        );
        //check user is stored or not
        if(!user){
            return res.status(404).json({message: 'User not found'});
        }
        // send user data with status 
        res.status(200).json(user);
    }
    catch(e){ // check error occur
        res.status(500).json({message: e.message}); // send error
    }
};



// get method for single user
exports.viewUser = async (req,res) => {
    try{
        const {id} = req.params; // get id as param
        const user = await User.findById( // check user by id
            id,
            {password: 0}
        );
        // check user is stored or not
        if(!user){
            return res.status(404).json({message: 'User not found'});//send error
        }
        res.status(200).json(user); // send response with data
    }
    catch(e){//catch error occur
        res.status(500).json({message: e.message}); // send error
    }
};



//update user 
exports.updateUser = async (req, res) => {
    try {
      const { id } = req.params; //get user id as param
      const { username, email } = req.body; //form data
  
      // Check if imagePath is  request body
      const imagePath = req.file ? req.file.path : null;
        // add pass data as update user object
      const updateUser = {
        username: username,
        email: email,
        imagePath: imagePath,
      };
      //find user using id
      const result = await User.findByIdAndUpdate(id, updateUser, { new: true });
      //check user is stored or not
      if (!result) {
        return res.status(404).json({ message: 'User not found' });//send error
      }
  
      res.status(200).json({
        message: 'User updated successfully', //send response data with status
        user: result,
      });
    } catch (e) { //catch error occure
      console.error('Error updating user:', e);
      res.status(500).json({ message: 'Internal Server Error' });//send error
    }
  };



//delete user 
exports.deleteUser = async (req, res) => {
    try {
      const { id } = req.params; // get user id as param
      const user = await User.findByIdAndDelete(id); // find user by id and delete
      //check user is stored or not
      if (!user) {
        return res.status(404).json({ message: 'User not found' });//send error
      }
      // delete user image from storage
      if (user.imagePath) {
        fs.unlinkSync(path.join(__dirname, `../../${user.imagePath}`));
      }
  
      res.status(200).json({ message: 'User deleted successfully' });//send response
    } catch (e) { //catch error occur
      console.error('Error deleting user:', e);
      res.status(500).json({ message: 'Internal Server Error' });//send error
    }
}





//logout user
exports.logout = async (req,res) => {
    try{
        res.clearCookie('token').json({message:'Logout successfully'}); // token clearance
    }
    catch(e){
        res.status(500).json({message: e.message});
    }
}



//reset password
exports.resetPassword = async (req, res) => {
const { token} = req.params // get token as param
    const {password} = req.body // get new pw as body

   
    try {
        // Verify the token
        const decoded = await Auth.verifyToken(token);
        console.log('Decoded token:', decoded);
        //if not verify send new error
        if (!decoded) throw new Error();
        // add decode id to user id variable
        const userId = decoded.id;
        // Hash the new password
        const hashedPassword = await Auth.hashPassword(password);

        // Update the user's password 
        await User.findByIdAndUpdate(userId, { password: hashedPassword });

        // Fetch the updated user details
        const updatedUser = await User.findById(userId);
        console.log('User details after password reset:', updatedUser);

        // Response update data with status
        res.status(200).json({ message: 'Password reset successfully', user: updatedUser });
    }
    catch (error) { // catch error occur
        console.error('Error in token verification:', error);
        res.status(400).json({ error: { message: 'Invalid or expired token' } }); // send error
    }
}






// forgot pw method
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body; // get user email as body
        let user = await User.findOne({ email }); //find user by email
        //check user stored or not
        if (!user) {
            return res.status(404).json({ error: { message: 'User not found' } }); // send error
        }
        // generate token to valid user
        const token = await Auth.generateToken(user);
        // send mail with token
        await sendMail({
            from: 'ericksera4@gmail.com',
            to: user.email,
            subject: 'Reset Password',
            html: `
                <h1>Reset Password</h1>
                <p>Hi ${user.username},</p>
                <p>You have requested to reset your password.</p>
                <p>Click on the link below to reset your password.</p>
          
                <a href="https://it-21360978.github.io/Front-End-blog/reset/${token}">Reset Password</a>

                <p>Best Regards,</p>
                <p>Blog App Team</p>
            `,
        });
        //console.log(token)
        res.status(200).json({
            token,
            message: 'Reset password link has been sent to your email', // send response token with msg
        });
    } catch (error) { // catch error occur
        console.error('Error in forgotPassword:', error);
        res.status(500).json({ error: { message: 'Error sending reset password email' } }); // send error
    }
};










