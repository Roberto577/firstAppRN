const postModel = require("../models/postModel");

//Create post
const createPostController = async (req,res) => {
    try {
        const {title, description} = req.body;
        //Validation
        if(!title || !description){
            return res.status(500).send({
                success: false,
                message: 'Please provide all fields'
            })
        }
        const post = await postModel({
            title,
            description,
            postedBy: req.auth._id,
        }).save();
        res.status(201).send({
            success: true,
            message: 'Post Created Succesfully',
            post,
        });
        console.log(req)
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: true,
            message: 'Error in create Post Api',
            error,
        })
    }
};

//GET ALL POSTS
const getAllPostsController = async (req,res) => {
    try {
        const posts = await postModel.find()
        .populate('postedBy', '_id name')
        .sort({createdAt: -1})
        res.status(200).send({
            success: true,
            message: 'All Posts Data',
            posts
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error in GetAllPostsApi',
            error
        })
    }
};

//GET POST USER
const getUserPostsController = async (req,res) => {
    try {
        const userPosts = await postModel.find({postedBy: req.auth._id});
        res.status(200).send({
            success: true,
            message: 'user posts',
            userPosts
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: 'Error in user POST APi'
        })
    }
}

//DELETE POST
const deletePostController = async (req,res) => {
    try {
        const {id} = req.params;
        await postModel.findByIdAndDelete({_id:id});
        res.status(200).send({
            success: true,
            message: 'Your Post been deleted',
        });
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: 'Error in delete post API'
        })
    }
};

//EDIT POST
const updatePostController = async (req,res) => {
    try {
        const {title, description} = req.body;
        //post find
        const post = await postModel.findById({ _id: req.params.id });
        //validation
        if(!title || !description){
            return res.status(500).send({
                succes: false,
                message: 'Please provide post title or description',
            })
        }
        const updatePost = await postModel.findByIdAndUpdate({ _id: req.params.id }, 
            {
                title: title || post?.title,
                description: description || post?.description
            }, {new:true}
        );
        res.status(200).send({
            success: true,
            message: 'Post updated successfully',
            updatePost
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: 'Error in update post API'
        })
    }
};

module.exports = { createPostController, getAllPostsController, getUserPostsController, deletePostController, updatePostController };