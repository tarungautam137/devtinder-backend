const express=require('express');
const userRouter=express.Router();
const connectionRequestModel=require('../models/connectionRequest');
const {userAuth}=require("../middlewares/userauth");
const userModel=require("../models/user");

userRouter.get("/user/requests",userAuth,async(req,res)=>{
    try{

        const crs=await connectionRequestModel.find({
            toUserId:req.user._id,
            status:"interested"
        }).populate("fromUserId","firstName lastName age gender photoUrl about")

        res.json({message:"data fetched successfully",data:crs});
    }
    catch(err){
        res.status(400).send(err.message);
    }
})

userRouter.get("/user/connections",userAuth,async(req,res)=>{
    try{
        const loggedInId=req.user._id;

        const crs=await connectionRequestModel.find({
            $or:[{fromUserId:loggedInId,status:"accepted"},{toUserId:loggedInId,status:"accepted"}]
        }).populate("fromUserId","firstName lastName photoUrl age gender about").populate("toUserId","firstName lastName photoUrl age gender about")

        const data=crs.map((row)=>{
            if(row.fromUserId._id.toString()===loggedInId.toString()) return row.toUserId;
            return row.fromUserId;
        })
        res.json({data:data});
    }
    catch(err){
        res.status(400).send(err.message);
    }
})

userRouter.get("/feed",userAuth,async (req,res)=>{
    try{

        const loggedInId=req.user._id;

        const crs=await connectionRequestModel.find({
            $or:[{fromUserId:loggedInId},{toUserId:loggedInId}]
        }).select("fromUserId toUserId")

        const page=parseInt(req.query.page) || 1;
        const limit=parseInt(req.query.limit) || 10;
        limit>50?50:limit

        const uniqueIds=new Set();
        crs.forEach(req=>{
            uniqueIds.add(req.fromUserId);
            uniqueIds.add(req.toUserId);
        })
        
        const users=await userModel.find({
            $and:[{_id:{$nin:Array.from(uniqueIds)}},{_id:{$ne:loggedInId}}]
        }).select("firstName lastName age gender photoUrl about").skip((page-1)*limit).limit(limit)

        res.send(users)
    }
    catch(err){res.status(400).send(err.message)}
})
module.exports=userRouter;