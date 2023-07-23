const multer = require("multer");
const sharp = require("sharp")
const path = require("path");//storing our images before uploading to the cloud
const fs = require("fs");

//setting multer
//setting our multer storage
const multerStorage = multer.diskStorage({//diskStorage is type of storage
    //creating adestination and filename function with req,file and cb(callback) arguent
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,"../public/images"));
    },
    filename:function(req,file,cb){
        const uniqueSuffix = Date.now() + "." + Math.round(Math.random()*1e9);
        cb(null,file.fieldname + "."+ uniqueSuffix + ".jpeg");
    }
});


//multer filter
const multerFilter = (req,file,cb) => {
    if (file.mimetype.startsWith('image')){
        cb(null,true);
    }
    else{
        cb({
            message:"unsupported file format",
        },
        false
        );
    }
};

//setting multer for uploading photo
const uploadPhoto = multer({
    storage:multerStorage,
    fileFilter:multerFilter,
    limits:{fieldSize:2000000},
});



//Post Resizing
const postImgResize = async(req,res,next) => {
    if(!req.files) return next();
    await Promise.all(
        req.files.map(async (file) => {
            await sharp(file.path)
            .resize(300,300)
            .toFormat("jpeg")
            .jpeg({quality:90})
            .toFile(`public/images/posts/${file.filename}`);
          fs.unlinkSync(`public/images/posts/${file.filename}`);  
        })
    );
    next();
};
module.exports = {uploadPhoto,postImgResize};