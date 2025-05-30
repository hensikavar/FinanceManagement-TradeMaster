const mongoose = require("mongoose");
const usermodel = require("../model/user");
const bcrypt = require("bcrypt");

const signup = async(req,res)=>{
    const{name,email,password}=req.body;

    if(!name || !email || !password){
        res.status(422).json({error: "Please enter all the fields"});
    }

    
    try{
        //checking for existing user
        const extistinguser = await usermodel.findOne({email:email});

        if(extistinguser){
            return res.status(400).json({
                error:"user already exists with this username"
            });
        }

        //hashed password
        const hashedPassword = await bcrypt.hash(password,10);

        //creating document
        const result = await usermodel.create({
            name:name,
            email:email,
            password:hashedPassword
        })

        res.status(200).json({User:result, message:"Registered Successfully"})
    }
    catch(error){
        console.log(error);
        res.status(422).json({error:"something went wrong"});
    }
}

const signin = async (req,res)=>{
    const {email,password}=req.body;

    if(!email || !password){
        res.status(422).json({error :  "Please enter email and Password"});
    }

    try{
        //checking for email of extisting user
        const extistinguser = await usermodel.findOne({email:email});

        if(!extistinguser){
            return res.status(404).json({
                error:"Invalid email"
            })
        }

        //comparing the password
        const extistingpassword = await bcrypt.compare(password,extistinguser.password);

        if(!extistingpassword){
            return res.status(404).json({error:"Invalid Credentials"});
        }

        //if all credentials are satisfied then it will show success message
        res.status(201).json({message:"Signed in Successfully"});
    }
    catch(error){
        console.log(error);
        res.status(422).json({error:"something went wrong"});
    }
}

module.exports={signup, signin};