const express = require('express');
const { requireSingIn } = require('../controllers/userController');
const { createPostController, getAllPostsController, getUserPostsController, deletePostController, updatePostController } = require('../controllers/postController');

//router object
const router = express.Router();

//CREATE POST || POST
router.post('/create-post', requireSingIn, createPostController);

//Get all POSTS
router.get('/get-all-post', getAllPostsController);

//Get USER POSTS
router.get('/get-user-post', requireSingIn, getUserPostsController);

//DELETE POST
router.delete('/delete-post/:id', requireSingIn, deletePostController);

//UPDATE POST
router.put('/update-post/:id', requireSingIn, updatePostController);

//export
module.exports = router;