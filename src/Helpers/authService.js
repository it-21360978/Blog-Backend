
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// hash password 
exports.hashPassword = async (password) => {
  return new Promise((resolve , reject)=>{
    //generate salt around 10
    bcrypt.genSalt(10, (err,salt)=>{
      if(err) reject("Error creating salt");// if occur error send msg

      //hash password using bcrypt
      bcrypt.hash(password, salt, (err,hash)=>{
        if(err) reject("Error hashing password"); // if occur error send msg

        resolve(hash);
      })
    })

  })

};



// compare password input with db
exports.passwordCompare = async (password, hashed) => {
  try {
    return await bcrypt.compare(password, hashed); // compare pw with hashed pw
  } catch (error) {
    throw new Error(`Error comparing passwords: ${error.message}`); // if occur error, throw  error msg
  }
}



// generate token
exports.generateToken = async (user) => {
  try {
    //sign user details for generate token
    return await jwt.sign(
      { email: user.email, id: user._id, username: user.username },
      process.env.JWT_SECRET,
      {expiresIn:'1d'}
    );
  } catch (error) { // if error occur
    throw new Error(`Error generating token: ${error.message}`); // throw error msg
  }
}



// verify token
exports.verifyToken = async (token) => {
  try {
    // verify input token with generated token
    return await jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) { // if occur error
    throw new Error(`Error verifying token: ${error.message}`); // throw error
  }
}




// exports.verifyToken = async (token) => {
//   try {
//     if (!token || typeof token !== 'string') {
//       throw new Error('Token is missing or has an invalid format');
//     }

//     const tokenParts = token.split(' ');

//     if (tokenParts.length !== 2) {
//       throw new Error('Token format is invalid');
//     }

//     const tokenValue = tokenParts[1];
//     return await jwt.verify(tokenValue, process.env.JWT_SECRET);
//   } catch (error) {
//     throw new Error(`Error verifying token: ${error.message}`);
//   }
// };







