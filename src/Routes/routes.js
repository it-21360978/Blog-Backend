const router = require ('express').Router();
const BlogController = require ('../Controllers/blogController');
const UserController = require('../Controllers/userController');
const CommentController = require ('../Controllers/commentController');
const {blogUpload,userUpload} = require('../Middlewares/blogUpload');
const FeedbackController = require ('../Controllers/feedbackController');
const cors = require ('cors');

router.use(cors({
    origin: '*',
    credentials: true,
}));


//BLOG ROUTES
router.route('/').post(blogUpload,BlogController.createBlog);
router.route('/').get(BlogController.getBlog);
router.route('/blog/:id').get(BlogController.viewBlog);
router.route('/blog/:id').put(blogUpload,BlogController.updateBlog);
router.route('/blog/:id').delete(BlogController.deleteBlog);


//USER ROUTES
router.route('/signup').post(userUpload,UserController.register);
router.route('/login').post(UserController.login);
router.route('/logout').post(UserController.logout);
router.route('/user').get(UserController.getUser);
router.route('/user/:id').get(UserController.viewUser);
router.route('/user/:id').put(userUpload,UserController.updateUser);
router.route('/user/:id').delete(UserController.deleteUser);
router.route('/user/forgot').post(UserController.forgotPassword);
router.route('/user/reset/:token').post(UserController.resetPassword);
router.route('/user/:id/update').put(userUpload,UserController.updateUser);
router.route('/user/delete/:id').delete(UserController.deleteUser);

//router.route('/profile').get(UserController.profile);

//Comment Routes
router.route('/blog/:id/comment').post(CommentController.createComment);
router.route('/blog/:id/comment/:commentId/reply').post(CommentController.createReply);
router.route('/blog/:id/comments').get(CommentController.allComments);

//Feedback Routes
router.route('/feedback').post(FeedbackController.createFeedback);
















module.exports = router;
