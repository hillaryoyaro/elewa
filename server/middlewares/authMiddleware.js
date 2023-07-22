const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const asynchandler = require("express-async-handler");

// authMiddleware -->Geting the user object
const authMiddleware = asynchandler(async(req,res,next) => {
    let token;
    if(req?.headers?.authorization?.startsWith('Bearer')){
        token = req.headers.authorization.split(" ")[1];
        try{
            //if token is found,find the user from decoded token
            if(token) {
                const decoded = jwt.verify(token,process.env.JWT_SECRET);
                const user = await User.findById(decoded?.id);
                req.user = user;
                next();
            }
        }catch(error){
            throw new Error("Not Authorized token expired please Login again");
        }
    }else{
        throw new Error("There is no token attatched to the header")
    }
});

//is Admin middleware
const isAdmin = asynchandler(async(req,res,next) => {
    console.log(req.user);
    const {email} = req.user;
    const adminUser = await User.findOne({email});
    if(adminUser.role !== "admin"){
        throw new Error("You are not an admin");
    }else{
        //pass the request
      next(); 
    }
});

module.exports = {authMiddleware,isAdmin};