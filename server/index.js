//creating server
const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const dbConnect = require('./config/dbConnect');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const cookieParser = require("cookie-parser");
const app = express();
const dotenv = require ('dotenv').config();
const PORT = process.env.PORT || 4000;
const cors = require("cors");
const authRouter = require("./routes/authRoute");

dbConnect();

//registering the dependencies
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());
app.use(cors({
    origin: process.env.CORS_ORIGIN
  }));

//registering the routes
app.use("/api/user",authRouter);




app.use(notFound);
app.use(errorHandler);
app.listen(PORT,()=>{
    console.log(`server is running at PORT ${PORT}`);
});
