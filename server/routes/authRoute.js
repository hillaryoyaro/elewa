const express = require('express');
const {createUser, loginUserCtr} = require("../contollers/userCtrl");
const router = express.Router();

router.post("/register",createUser);
router.post("/login",loginUserCtr)
module.exports = router;