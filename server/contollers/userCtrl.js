const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

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
      
        res.json(findUser);
    }else{
        throw new Error("Invalid Credentials");
    };
});    
module.exports = {
    createUser,
    loginUserCtr
};