const express=require('express');

const chatRouter=express.Router();

const chatModel=require("../models/chat");
const {userAuth}=require("../middlewares/userauth");
chatRouter.get("/chat/:targetUserId",userAuth,async(req,res)=>{

    const loggedInUserId=req.user._id;
    const {targetUserId}=req.params

    try{
        let chat=await chatModel.findOne({
            participants:{$all:[loggedInUserId,targetUserId]}
        }).populate({
            path:"messages.senderId",
            select:"firstName lastName"
        })

        if(!chat) {
            chat=new chatModel({
                participants:[loggedInUserId,targetUserId],
                messages:[]
            })
            await chat.save();
        }
        res.json(chat)
    }
    catch(err){console.log(err)}
})

module.exports=chatRouter;