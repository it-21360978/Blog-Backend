const Feedback = require('../Models/feedBackModel');


//feedback post method
exports.createFeedback = async (req, res) => {
    try {
        // email,subject,messgae get request body
        const { email, subject, message } = req.body;
        // create feedback
        const feedback = await Feedback.create({ email, subject, message });
        // send feedback response
        res.status(201).json(feedback);
        
    } catch (error) { // if has error occur
        console.error(error); // Log the error for debugging purposes
        res.status(500).json({ error: 'Internal Server Error' }); // response error 
    }
    };