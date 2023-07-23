const Post = require("../models/postModel");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../Utils/validateMongodbId");
const { validate } = require("../models/postModel");
const cloudinaryUploadingImg = require("../Utils/cloudinary");
const fs = require("fs");

//create post
const createPost = asyncHandler(async(req,res) => {
    try{
        const newPost = await Post.create(req.body);
        res.json(newPost);
    }catch(error){
        throw new Error(error);
    }
});

//update post
const updatePost = asyncHandler(async(req,res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const updatePost = await Post.findById(id,req.body,{
            new:true
        });
        res.json(updatePost);
    }catch(error){
        throw new Error(error);
    }
});

//get post
const getPost = asyncHandler(async(req,res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const getPost = await Post.findById(id).populate("likes");
        const getupdate = await Post.findByIdAndUpdate(
        id,
        {
            $inc:{numViews:1},
        },
        {new:true}
        );
        res.json(getPost);
    }catch(error){
        throw new Error(error);
    }
});

//Get all Posts
const getAllPosts = asyncHandler(async(req,res) => {
    try{
        const getPosts = await Post.find();
        res.json(getPosts);
    }catch(error){
        throw new Error(error);
    }
});

//Delete Post
const deletePost = asyncHandler(async(req,res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const deletePost = await Post.findByIdAndDelete(id);
        res.json(deletePost);
    }catch(error){
        throw new Error(error);
    }
});

//Like Post
const likePost = asyncHandler(async (req, res) => {
    try {
      // Get the postId from the request body
      const { postId } = req.body;
  
      // Validate the postId
      validateMongoDbId(postId); 
      // Find the post to be liked
      const post = await Post.findById(postId);
  
      // Get the ID of the logged-in user
      const loginUserId = req?.user?._id;
  
      // Check if the user has already disliked the post
      const alreadyDisliked = post?.dislikes.find(
        userId => userId?.toString() === loginUserId?.toString()
      );
  
      // If the user has already disliked the post, remove the dislike
      if (alreadyDisliked) {
        const updatedPost = await Post.findByIdAndUpdate(
          postId,
          { $pull: { dislikes: loginUserId }, isDisliked: false },
          { new: true }
        );
        return res.json(updatedPost);
      }
  
      // Check if the user has already liked the post
      const isLiked = post?.isLiked;
  
      // If the user has already liked the post, remove the like
      if (isLiked) {
        const updatedPost = await Post.findByIdAndUpdate(
          postId,
          { $pull: { likes: loginUserId }, isLiked: false },
          { new: true }
        );
        return res.json(updatedPost);
      }
  
      // Otherwise, add the like
      const updatedPost = await Post.findByIdAndUpdate(
        postId,
        { $push: { likes: loginUserId }, isLiked: true },
        { new: true }
      );
      return res.json(updatedPost);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  });

  //disLike Post
const dislikePost = asyncHandler(async (req, res) => {
    try {
      // Get the postId from the request body
      const { postId } = req.body;
  
      // Validate the postId
      validateMongoDbId(postId); 
      // Find the post to be liked
      const post = await Post.findById(postId);
  
      // Get the ID of the logged-in user
      const loginUserId = req?.user?._id;
  
      // Check if the user has already liked the post
      const alreadyliked = post?.dislikes.find(
        userId => userId?.toString() === loginUserId?.toString()
      );
  
      // If the user has already liked the post, remove the like
      if (alreadyliked) {
        const updatedPost = await Post.findByIdAndUpdate(
          postId,
          { $pull: { likes: loginUserId }, isLiked: false },
          { new: true }
        );
        return res.json(updatedPost);
      }
  
      // Check if the user has already liked the post
      const isDisliked = post?.isDisliked;
  
      // If the user has already disliked the post, remove the dislike
      if (isDisliked) {
        const updatedPost = await Post.findByIdAndUpdate(
          postId,
          { $pull: { dislikes: loginUserId }, isDisliked: false },
          { new: true }
        );
        return res.json(updatedPost);
      }
  
      // Otherwise, add the like
      const updatedPost = await Post.findByIdAndUpdate(
        postId,
        { $push: { likes: loginUserId }, isLiked: true },
        { new: true }
      );
      return res.json(updatedPost);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  });

  //Upload Images
const uploadImages = asyncHandler(async(req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const uploader = (path) => cloudinaryUploadingImg(path, "images");
        const urls = [];
        const files = req.files;
        for (const file of files) {
            const { path } = file;
            const newPath = await uploader(path);
            urls.push(newPath);
            fs.unlinkSync(path);
        }
        const findPost = await Post.findByIdAndUpdate(
            id,
            {
                images: urls.map((file) => {
                    return file;
                }),
            },
            {
                new: true,
            }
        );
        res.json(findPost);
    } catch (error) {
        throw new Error(error);
    }
  });


module.exports = {
    createPost,
    updatePost,
    getPost,
    getAllPosts,
    deletePost,
    likePost,
    dislikePost,
    uploadImages
}