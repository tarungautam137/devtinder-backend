const express = require('express');
const profileRouter=express.Router();
const {userAuth}=require("../middlewares/userauth");
const {validateDataToBeUpdated,validatePassword}=require("../utils/validate")


profileRouter.get("/profile/view",userAuth,async (req,res)=>{

    const user=req.user
    res.send(user);
})

profileRouter.patch("/profile/edit",userAuth,async (req,res)=>{

    try{
        if(!validateDataToBeUpdated(req.body)) throw new Error("cannot update profile")
        
        const loggedInUser=req.user

        Object.keys(req.body).forEach(field=>{loggedInUser[field] = req.body[field]})

        await loggedInUser.save()

        res.json({
            message:`${loggedInUser.firstName} your profile has been updated`,
            data:loggedInUser
        })
    }
    catch(err){
        console.log(err.message)
        res.status(400).send(" "+err.message)
    }
})

profileRouter.patch("/profile/password",userAuth,async (req,res)=>{

    try{
        if(!validatePassword(req.body.newpassword)) throw new Error("new password must be strong")
        
        const user=req.user
        if(!user.verifyPassword(req.body.existingpassword)) throw new Error("Incorrect existing password");

        user.password=await bcrypt.hash(req.body.newpassword,10)
        await user.save()

        res.send(`${user.firstName} your password has been updated`)
    }
    catch(err){
        res.status(400).send(" "+err.message)
    }
})
module.exports = profileRouter;