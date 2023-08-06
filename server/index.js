//creating the server

import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";

//native packages
import path from "path" ; //this is install from node already
import { fileURLToPath } from "url";//properly set the path when we configure directories

/** CONFIGURATION---All the middleware configuration--- */
const __filename = fileURLToPath(import.meta.url);//help to grab file url
const __dirname = path.dirname(__filename);//this is only applicable when you use type module

dotenv.config();//invoke the config
const app = express(); //invoke our express application and use our middleware
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy:"cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json({limit:"30mb",extended:true}));
app.use(bodyParser.urlencoded({limit:"30" ,extended: true }));
app.use(cors());//this will invoke our cross origin resource sharing policy
//set the directory where we keep ou assets-->images that we store---
app.use("/assets",express.static(path.join(__dirname,"public/assets")));
//import our routes from controller

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js"
import postRoutes from "./routes/post.js"

import { register } from "./controllers/auth.js";
import { createPost} from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
//data---passing fake data--
import User from "./models/User.js";
import Post from "./models/Post.js";
import { users,posts } from "./data/index.js";


/**SET THE FILE STORAGE CONFIGURATIION---from multir documentation**/

//storage function
const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,"public/assets");
    },
    filename:function (req,file,cb){
        cb(null,file.originalname);
    }
});
//upload variable to help to save the file
const upload = multer({storage});

/**ROUTES WITH FILES**/
//upload our picture locally in storage function using the middleware
//This route is separate because it uses upload valiable to upload files
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts",verifyToken, upload.single("picture"),createPost);

/**REGISTERING OUR ROUTES--Setting our routes and keep ou file organize**/
app.use("/auth",authRoutes);
app.use("/users",userRoutes);
app.use("/posts",postRoutes);



/** MONGOOSE SETUP AND CONNECTION TO DATABASE**/
const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(() => {
    app.listen(PORT,() => console.log(`Server Port: ${PORT}`));

    /**ADD DATA ONE TIME**/
    //---manually inject this information--comment ou the User and Post object to a void duplicate
    //User.insertMany(users);
    //Post.insertMany(posts);
}).catch((error) => console.log(`${error} did not connect `));
