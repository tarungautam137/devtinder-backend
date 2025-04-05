const express = require('express');
const authRouter=express.Router();
const {validate}=require('../utils/validate');
const bcrypt=require('bcrypt');
const UserModel=require("../models/user")
const validator=require("validator")

authRouter.post("/signup",async (req,res)=>{

    
    try{
        
        validate(req);
        const {firstName,lastName,email,password}=req.body;
        
        const hashedPassword=await bcrypt.hash(password,10)
        const user=new UserModel({
            firstName,
            lastName,
            email,
            password:hashedPassword
        })

        const savedUser=await user.save()

        const token=savedUser.getJWT();
        
        res.cookie("bourbon",token)

        res.json({message:"User saved successfully",data:savedUser})
    }
    catch(err){
        
        res.status(400).send(" "+err.message+"beqefw")
    }
})
authRouter.post("/login",async (req,res)=>{

    const {email,password} = req.body
    try{

        if(!validator.isEmail(email)){
            throw new Error("Invalid email address")
        }
        const user=await UserModel.findOne({email:email})
        if(!user) throw new Error("User not found")

        const isMatch=await user.verifyPassword(password)
        if(!isMatch) throw new Error("Invalid password")

        const token=user.getJWT();
        
        res.cookie("bourbon",token)
        res.send(user)
    }
    catch(err){
        res.status(400).send(" "+err.message)
    }
})
authRouter.post("/logout",(req,res)=>{

    res.cookie("bourbon","",{expires:new Date(Date.now() + 0)});
    res.send("Logged out successfully");
})

module.exports=authRouter;