const multer = require('multer');


// config blog storage in server 
const blogStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/blogs'); // add serevr storage destination
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // save image with name and date
    },
});


// config user storage in server
const userStorage = multer.diskStorage({
    destination: (req, file, cb) => { // add des to store image
        cb(null, 'uploads/user');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // save image as name with date
    },
});



// filter blog image
const filterBlog = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png']; // check image type to input
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

//filter user image
const filterUser = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png'];//check image type to input
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

// upload blog image
const blogUpload = multer({ storage: blogStorage, fileFilter: filterBlog }).single('imagePath');
//upload user image 
const userUpload = multer({ storage: userStorage, fileFilter: filterUser }).single('imagePath');

module.exports = { blogUpload, userUpload };
