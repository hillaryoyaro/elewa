const express = require("express");
const { authMiddleware, isAdmin} = require('../middlewares/authMiddleware');
const { 
    createPost, 
    updatePost, 
    getPost, 
    getAllPosts, 
    deletePost, 
    likePost,
    dislikePost,
    uploadImages} = require("../contollers/postCtrl");
const { uploadPhoto, postImgResize } = require("../middlewares/uploadImages");
const router = express.Router();

router.post("/",authMiddleware,isAdmin,createPost);
router.put("/likes",authMiddleware,isAdmin,likePost);
router.put("/dislikes",authMiddleware,isAdmin,dislikePost);
router.put("/upload/:id",authMiddleware,isAdmin,uploadPhoto.array('images',10),postImgResize,uploadImages);

router.put("/:id",authMiddleware,isAdmin,updatePost);
router.get("/:id",getPost);
router.get("/",getAllPosts);
router.delete("/:id",authMiddleware,isAdmin,deletePost);


module.exports = router;