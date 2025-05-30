//creating object of express Router
const express = require("express");
const userrouter = express.Router();

//importing variables of Controller
const {signup,signin}=require("../controller/usercontroller")

//testing
userrouter.get("/",(req,res)=>{
    res.send("Hello ");
})

//on posting data signup and signin controller will execute
userrouter.post("/signup",signup);

userrouter.post("/signin",signin);

module.exports=userrouter;