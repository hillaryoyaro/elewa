import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/*REGISTER USER*/
export const register = async (req,res) => {
    try{
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            occupation,
        } = req.body;
const salt = await bcrypt.genSalt();//this is encrypting our password
const passwordHash = await bcrypt.hash(password,salt);//not not to expose our passwaord

const newUser = new User({
    firstName,
    lastName,
    email,
    password : passwordHash,
    picturePath,
    friends,
    occupation,
    viewedProfile :Math.floor(Math.random() * 1000),
    impressions :Math.floor(Math.random() * 1000),
});

const savedUser = await newUser.save();
res.status(201).json(savedUser);
    }catch(error){
        res.status(500).json({error: error.message});
    }
}

/**LOGGIN IN**/
export const login = async (req,res) => {
    try{
        const { email,password } = req.body;
        const user = await User.findOne({email:email});
        if (!user) return res.status(400).json({msg:"User does not exist."});
        //use bcypt to compare the passwaord they just send and saved user password
        const ismatch = await bcrypt.compare(password,user.password);
        if (!ismatch) return res.status(400).json({msg:"Invalid Credentials."});

        //using jwt token to verify login
        const token = jwt.sign({ id:user._id },process.env.JWT_SECRET);
        //delete the password using token
        delete user.password;
        res.status(200).json({ token,user });
    }catch(error){
        res.status(500).json({error: error.message}); 
    }
}