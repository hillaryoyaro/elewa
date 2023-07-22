const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwtToken");
const validateMongodbId = require("../Utils/validateMongodbId");
const { generateRefreshToken } = require("../config/refreshToken");
const jwt = require("jsonwebtoken");


//Create a user
const createUser = asyncHandler(async (req, res) => {
        const email = req.body.email;
        const findUser = await User.findOne({email:email});
        if (!findUser) {
            //creating instance of  anew user
            const newUser =  await User.create(req.body);
            res.json(newUser)
        } else{
           throw new Error("User Already Exist");
        }
    });

//User Login
const loginUserCtr = asyncHandler(async(req,res) =>{
    const {email,password} = req.body;
    //check if user exist or not
    const findUser = await User.findOne({email});
    if (findUser && ( await findUser.isPasswordMatched(password))){
        const refreshToken = await generateRefreshToken(findUser?.id);
        const updateuser = await User.findByIdAndUpdate(findUser.id,
            {
                refreshToken:refreshToken,
            },
            {
                new:true
            }
        );
        res.cookie("refreshToken",refreshToken,
         {
         httpOnly:true,
         maxAge: 72 * 60 * 60 * 1000,
         });
        res.json({
            _id: findUser?._id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            username: findUser?.username,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: generateToken(findUser?._id)
        });
    }else{
        throw new Error("Invalid Credentials");
    };
});

//Get all users ---> async Handler
const getallUser = asyncHandler(async(req,res) => {
    try{
        const getUsers = await User.find();
        res.json(getUsers);
    }
    catch(error){
        throw new Error(error);
    }
});

//Get user ---> async Handler
const getUser = asyncHandler(async(req,res) =>{
    const {id} = req.params;
    validateMongodbId(id);
    try{
        const getuser = await User.findById(id);
        res.json({getuser});
    }
    catch(error){
        throw new Error(error);
    }
});

//Delete user ---> async Handler
const deleteUser = asyncHandler(async(req,res) =>{
    const {id} = req.params;
    validateMongodbId(id);
    try{
        const deleteuser = await User.findByIdAndDelete(id);
        res.json({deleteuser});
    }
    catch(error){
        throw new Error(error);
    }
});

//Update User ---> we will wrap inside asyncHandler module
const updateUser = asyncHandler(async(req,res) => {
    const {_id} = req.user;
    //validateMongodbId(_id);
    try{
        const updateuser = await User.findByIdAndUpdate(_id,{
            firstname: req?.body?.firstname,
            lastname: req?.body?.lastname,
            username: req?.body?.username,
            email: req?.body?.email,
            mobile: req?.body?.mobile,
        },
        {
            new:true,
        }
        );
        res.json(updateuser); 
    }
    catch(error){
        throw new Error(error);
    }
});

//block user -->wrapping inside asynchandler
const blockUser = asyncHandler(async(req,res) => {
    console.log(req.params);
    const {id} = req.params;
    validateMongodbId(id);
    try{
        const block = await User.findByIdAndUpdate(
        id,
        {
            isBlocked:true,
        },
        {
            new:true
        });
        res.json({
            message:"User Blocked"
        });
    }catch(error){
        throw new Error(error);
    }
});

//unblock user -->wrapping inside asynchandler
const unblockUser = asyncHandler(async(req,res) => {
    const {id} = req.params;
    validateMongodbId(id);
    try{
        const unblock = await User.findByIdAndUpdate(
            id,
            {
                isBlocked:false,
            },
            {
                new:true,
            }
            )
            res.json({
                message:"User UnBlocked"
            });
    }catch(error){
        throw new Error(error);
    }
});

//Handle RefreshToken --->AsyncHandler
const handleRefreshToken = asyncHandler(async (req,res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
    const refreshToken = cookie.refreshToken;
    console.log(refreshToken);
    const user = await User.findOne({refreshToken});
    if (!user) throw new Error('No Refresh token in the db or not matched');
    jwt.verify(refreshToken,process.env.JWT_SECRET,(err,decoded) => {
        if (err || user.id !== decoded.id){
            throw new Error("There is something wrong with Refresh token");
        }
        const accessToken = generateToken(user?._id);
        res.json({accessToken}); 
    });
});

// Logout function
const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
    const refreshToken = cookie.refreshToken;

    const user = await User.findOne({ refreshToken: refreshToken });
    if (!user) {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
        });
        return res.sendStatus(204); // Forbidden
    }

    await User.findOneAndUpdate(
        { refreshToken: refreshToken }, // Corrected filter object
        { refreshToken: "" } // Data to update
    );

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
    });
    res.sendStatus(204); // Forbidden
});



        
module.exports = {
    createUser,
    loginUserCtr,
    getallUser,
    getUser,
    deleteUser,
    updateUser,
    blockUser,
    unblockUser,
    handleRefreshToken,
    logout
};