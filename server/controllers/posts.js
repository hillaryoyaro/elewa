import Post from "../models/Post.js";
import User from "../models/User.js";

/**Create Post **/
export const createPost = async (req,res) => {
    try{
        //input from frontend that can be send to us
        const { userId,description,picturePath } = res.body;
        //Grab the user who as posted from database
        const user = await User.findById(userId);
        //create object(post) using the new keyword into our database
        const newPost = new Post({
            userId,
            firstName:user.firstName,
            lastName:user.lastName,
            location:user.location,
            description,
            userPicturePath:user.picturePath,
            picturePath,
            likes: {},//empty map
            comment: [],//empty array/object
        })
        await newPost.save();//save into mongodb

        //Grabbing all the post and return to frontend
        const post = await Post.find();
        res.status(201).json(post);
    }catch(err){
        res.status(409).json({message: err.message});
    }
}

/**READ **/
//Get all the post from users
export const getFeedPosts = async (req,res) => {
    try{
        //Grabbing all the post and return to frontend
        const post = await Post.find();
        res.status(200).json(post);
    }catch(err){
        res.status(404).json({message: err.message});
    }
}

//Get User Feed
export const getUserPosts = async (req,res) => {
    try{
        //Grab userId from database 
        const { userId } = req.params;
        //Grab user post associated with the User id
        const post = await Post.find(userId);
        res.status(200).json(post);
    }catch(err){
        res.status(404).json({message:err.message});
    }
}

/**Update the user post**/
export const likePost = async (res,req) => {
    try{
        //Grab the post id from request params for particula user from query string
        const { id } = req.params;
        //Grab the userid from the body of request --- frontend
        const { userId } = req.body;
        //Grab user postd associated with the Userid
        const post = await Post.findById(id);
        //checks in the likes if the userId exist
        const isLiked = post.likes.get(userId);

        if (isLiked) {
            post.likes.delete(userId);
        }else{
            post.likes.set(userId,true);
        }
        //To update a specific post
        const updatedPost = await Post.findByIdAndUpadate(
            id,
            { likes:post.likes },
            { new: true } //creating new object
        );
        //Updating the frontend 
        res.status(200).json(updatedPost);
    }catch(err){
        res.status(404).json({message: err.message});
    }
}